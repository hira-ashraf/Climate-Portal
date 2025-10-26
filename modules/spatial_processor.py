import json
from typing import Dict, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text
from geoalchemy2.functions import ST_AsGeoJSON, ST_Area, ST_Centroid, ST_Distance, ST_Intersects
from shapely.geometry import shape, Point
from shapely import wkt
from config import Config

try:
    from modules.database import SessionLocal, AdministrativeUnit, check_database_connection
    POSTGIS_AVAILABLE = check_database_connection()
except:
    POSTGIS_AVAILABLE = False
    print("PostGIS not available, using fallback SQLite")

class SpatialProcessor:
    def __init__(self):
        self.db_path = Config.DATABASE_PATH
        self.use_postgis = POSTGIS_AVAILABLE
    
    def get_boundaries(self, level=1):
        """Get administrative boundaries - PostGIS optimized"""
        
        if self.use_postgis:
            return self._get_boundaries_postgis(level)
        else:
            return self._get_boundaries_sqlite(level)
    
    def _get_boundaries_postgis(self, level=1):
        """Get boundaries using PostGIS"""
        db = SessionLocal()
        try:
            # Query with spatial functions
            query = text("""
                SELECT 
                    id,
                    name,
                    level,
                    ST_AsGeoJSON(geometry) as geometry,
                    properties,
                    ST_Area(geography(geometry)) / 1000000 as area_km2
                FROM administrative_units
                WHERE level = :level
                ORDER BY name
            """)
            
            result = db.execute(query, {'level': level})
            rows = result.fetchall()
            
            features = []
            for row in rows:
                unit_id, name, lvl, geometry_json, properties_str, area_km2 = row
                
                geometry = json.loads(geometry_json) if geometry_json else None
                properties = json.loads(properties_str) if properties_str else {}
                properties['name'] = name
                properties['id'] = unit_id
                properties['area_km2'] = round(area_km2, 2) if area_km2 else None
                
                features.append({
                    'type': 'Feature',
                    'geometry': geometry,
                    'properties': properties
                })
            
            return {
                'type': 'FeatureCollection',
                'features': features
            }
        finally:
            db.close()
    
    def _get_boundaries_sqlite(self, level=1):
        """Fallback: Get boundaries using SQLite"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, name, level, geometry, properties
            FROM administrative_units
            WHERE level = ?
            ORDER BY name
        ''', (level,))
        
        rows = cursor.fetchall()
        conn.close()
        
        features = []
        for row in rows:
            unit_id, name, level, geometry_str, properties_str = row
            
            geometry = json.loads(geometry_str) if geometry_str else None
            properties = json.loads(properties_str) if properties_str else {}
            properties['name'] = name
            properties['id'] = unit_id
            
            features.append({
                'type': 'Feature',
                'geometry': geometry,
                'properties': properties
            })
        
        return {
            'type': 'FeatureCollection',
            'features': features
        }
    
    def add_climate_values_to_geojson(self, geojson, climate_data, variable):
        climate_dict = {item['name']: item['value'] for item in climate_data}
        
        for feature in geojson['features']:
            name = feature['properties']['name']
            value = climate_dict.get(name)
            
            feature['properties']['climate_value'] = value
            feature['properties']['climate_variable'] = variable
        
        return geojson
    
    def calculate_statistics(self, geojson, variable):
        values = []
        
        for feature in geojson['features']:
            value = feature['properties'].get('climate_value')
            if value is not None:
                values.append(value)
        
        if not values:
            return {'min': 0, 'max': 0, 'mean': 0, 'std': 0}
        
        mean = sum(values) / len(values)
        variance = sum((x - mean) ** 2 for x in values) / len(values)
        std = variance ** 0.5
        
        return {
            'min': round(min(values), 2),
            'max': round(max(values), 2),
            'mean': round(mean, 2),
            'std': round(std, 2)
        }
    
    def spatial_query_point(self, lon: float, lat: float, level: int = 1) -> Optional[Dict]:
        """
        Find which administrative unit contains a point (PostGIS optimized)
        """
        if not self.use_postgis:
            return None
        
        db = SessionLocal()
        try:
            query = text("""
                SELECT 
                    id,
                    name,
                    level,
                    ST_AsGeoJSON(geometry) as geometry
                FROM administrative_units
                WHERE level = :level
                AND ST_Contains(geometry, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326))
                LIMIT 1
            """)
            
            result = db.execute(query, {'level': level, 'lon': lon, 'lat': lat})
            row = result.fetchone()
            
            if row:
                return {
                    'id': row[0],
                    'name': row[1],
                    'level': row[2],
                    'geometry': json.loads(row[3]) if row[3] else None
                }
            return None
        finally:
            db.close()
    
    def spatial_buffer(self, lon: float, lat: float, radius_km: float) -> List[Dict]:
        """
        Find administrative units within a radius (PostGIS optimized)
        """
        if not self.use_postgis:
            return []
        
        db = SessionLocal()
        try:
            query = text("""
                SELECT 
                    id,
                    name,
                    ST_Distance(
                        geography(geometry),
                        geography(ST_SetSRID(ST_MakePoint(:lon, :lat), 4326))
                    ) / 1000 as distance_km
                FROM administrative_units
                WHERE ST_DWithin(
                    geography(geometry),
                    geography(ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)),
                    :radius_m
                )
                ORDER BY distance_km
            """)
            
            result = db.execute(query, {
                'lon': lon, 
                'lat': lat, 
                'radius_m': radius_km * 1000
            })
            
            units = []
            for row in result:
                units.append({
                    'id': row[0],
                    'name': row[1],
                    'distance_km': round(row[2], 2)
                })
            
            return units
        finally:
            db.close()
    
    def calculate_area(self, geometry_geojson: Dict) -> float:
        """
        Calculate area of a geometry in km² (PostGIS optimized)
        """
        if not self.use_postgis:
            # Fallback to shapely
            geom = shape(geometry_geojson)
            return geom.area
        
        db = SessionLocal()
        try:
            geom_str = json.dumps(geometry_geojson)
            query = text("""
                SELECT ST_Area(geography(ST_GeomFromGeoJSON(:geom))) / 1000000 as area_km2
            """)
            
            result = db.execute(query, {'geom': geom_str})
            row = result.fetchone()
            
            return round(row[0], 2) if row else 0.0
        finally:
            db.close()
