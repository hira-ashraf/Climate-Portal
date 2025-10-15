import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
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
    
    DATABASE_PATH = 'data/climate_data.db'
    
    CACHE_TIMEOUT = 3600
    
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
            'offset': -273.15
        },
        'precipitation': {
            'name': 'Precipitation',
            'unit': 'mm',
            'gee_band': 'total_precipitation',
            'scale_factor': 1000,
            'offset': 0
        },
        'humidity': {
            'name': 'Humidity',
            'unit': '%',
            'gee_band': 'dewpoint_temperature_2m',
            'scale_factor': 1,
            'offset': -273.15
        },
        'wind_speed': {
            'name': 'Wind Speed',
            'unit': 'm/s',
            'gee_band': 'u_component_of_wind_10m',
            'scale_factor': 1,
            'offset': 0
        }
    }
    
    DOWNLOAD_RATE_LIMIT = 5
    DOWNLOAD_TIMEOUT = 3600
