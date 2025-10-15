import sqlite3
import json
from config import Config

class SpatialProcessor:
    def __init__(self):
        self.db_path = Config.DATABASE_PATH
    
    def get_boundaries(self, level=1):
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
