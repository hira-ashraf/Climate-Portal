import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Geographic Configuration
    PAKISTAN_BOUNDS = {
        'west': 60.87,
        'east': 77.84,
        'south': 23.63,
        'north': 37.13
    }
    
    PAKISTAN_CENTER = {
        'lat': 30.3753,
        'lon': 69.3451,
        'zoom': 6
    }
    
    # Database Configuration - PostgreSQL with PostGIS
    DATABASE_URL = os.environ.get(
        'DATABASE_URL',
        'postgresql://postgres:postgres@localhost:5432/climate_portal'
    )
    DATABASE_PATH = 'data/climate_data.db'  # Fallback for SQLite
    
    # Redis Configuration
    REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
    REDIS_PORT = int(os.environ.get('REDIS_PORT', 6379))
    REDIS_DB = int(os.environ.get('REDIS_DB', 0))
    CACHE_TIMEOUT = 3600  # 1 hour
    CACHE_PREFIX = 'climate_portal:'
    
    # Google Earth Engine Configuration
    GEE_PROJECT_ID = os.environ.get('GEE_PROJECT_ID', '')
    GEE_SERVICE_ACCOUNT = os.environ.get('GEE_SERVICE_ACCOUNT', '')
    GEE_PRIVATE_KEY = os.environ.get('GEE_PRIVATE_KEY', '')
    
    ERA5_MONTHLY_DATASET = 'ECMWF/ERA5_LAND/MONTHLY_AGGR'
    ERA5_DAILY_DATASET = 'ECMWF/ERA5/DAILY'
    ERA5_HOURLY_DATASET = 'ECMWF/ERA5_LAND/HOURLY'
    
    AGGREGATION_TYPES = {
        'hourly': {'dataset': 'ECMWF/ERA5_LAND/HOURLY', 'scale': 11132},
        'daily': {'dataset': 'ECMWF/ERA5/DAILY', 'scale': 27830},
        'monthly': {'dataset': 'ECMWF/ERA5_LAND/MONTHLY_AGGR', 'scale': 11132},
        'seasonal': {'dataset': 'ECMWF/ERA5_LAND/MONTHLY_AGGR', 'scale': 11132},
        'annual': {'dataset': 'ECMWF/ERA5_LAND/MONTHLY_AGGR', 'scale': 11132}
    }
    
    CLIMATE_VARIABLES = {
        'temperature': {
            'name': 'Temperature',
            'unit': '°C',
            'gee_band': 'temperature_2m',
            'scale_factor': 1,
            'offset': -273.15,
            'description': 'Air temperature at 2 meters above surface'
        },
        'precipitation': {
            'name': 'Precipitation',
            'unit': 'mm',
            'gee_band': 'total_precipitation',
            'scale_factor': 1000,
            'offset': 0,
            'description': 'Total precipitation (rain + snow)'
        },
        'humidity': {
            'name': 'Relative Humidity',
            'unit': '%',
            'gee_band': 'dewpoint_temperature_2m',
            'scale_factor': 1,
            'offset': -273.15,
            'description': 'Relative humidity derived from dewpoint'
        },
        'wind_speed': {
            'name': 'Wind Speed',
            'unit': 'm/s',
            'gee_band': 'u_component_of_wind_10m',
            'scale_factor': 1,
            'offset': 0,
            'description': 'Wind speed at 10 meters above surface'
        },
        'solar_radiation': {
            'name': 'Solar Radiation',
            'unit': 'W/m²',
            'gee_band': 'surface_solar_radiation_downwards',
            'scale_factor': 1,
            'offset': 0,
            'description': 'Surface solar radiation downwards'
        }
    }
    
    # Derived Climate Indices Configuration
    CLIMATE_INDICES = {
        'heat_index': {
            'name': 'Heat Index',
            'unit': '°C',
            'description': 'Apparent temperature combining heat and humidity',
            'category': 'heat_stress'
        },
        'wbgt': {
            'name': 'Wet Bulb Globe Temperature',
            'unit': '°C',
            'description': 'Heat stress indicator for outdoor workers',
            'category': 'heat_stress'
        },
        'humidex': {
            'name': 'Humidex',
            'unit': 'Index',
            'description': 'Canadian humidity-adjusted temperature',
            'category': 'heat_stress'
        },
        'spi': {
            'name': 'Standardized Precipitation Index',
            'unit': 'Index',
            'description': 'Multi-scale drought indicator based on precipitation',
            'category': 'drought'
        },
        'spei': {
            'name': 'Standardized Precipitation-Evapotranspiration Index',
            'unit': 'Index',
            'description': 'Drought indicator considering water balance',
            'category': 'drought'
        },
        'palmer_drought': {
            'name': 'Palmer Drought Severity Index',
            'unit': 'Index',
            'description': 'Long-term drought indicator',
            'category': 'drought'
        }
    }
    
    # Extreme Event Thresholds (based on WMO standards)
    EXTREME_THRESHOLDS = {
        'temperature': {
            'very_hot': 40,      # °C
            'hot': 35,
            'cold': 10,
            'very_cold': 0
        },
        'precipitation': {
            'heavy': 50,         # mm/day
            'very_heavy': 100,
            'extreme': 200
        },
        'wind_speed': {
            'strong': 10.8,      # m/s (Beaufort 6)
            'gale': 17.2,        # Beaufort 8
            'storm': 24.5        # Beaufort 10
        }
    }
    
    DOWNLOAD_RATE_LIMIT = 5
    DOWNLOAD_TIMEOUT = 3600
