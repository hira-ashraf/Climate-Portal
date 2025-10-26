from .data_fetcher import ClimateDataFetcher
from .spatial_processor import SpatialProcessor
from .ml_models import ClimateForecaster
from .geemap_helper import GeeMapHelper

# New modules for enhanced functionality
try:
    from .database import init_database, get_db, SessionLocal, check_database_connection
    from .cache import RedisCache, cache
    from .climate_indices import HeatStressCalculator, DroughtIndicator, ExtremeEventAnalyzer
    
    DATABASE_AVAILABLE = True
    CACHE_AVAILABLE = True
except ImportError as e:
    print(f"Optional modules not available: {e}")
    DATABASE_AVAILABLE = False
    CACHE_AVAILABLE = False
    init_database = None
    get_db = None
    cache = None
    HeatStressCalculator = None
    DroughtIndicator = None
    ExtremeEventAnalyzer = None

__all__ = [
    'ClimateDataFetcher',
    'SpatialProcessor', 
    'ClimateForecaster',
    'GeeMapHelper',
    'init_database',
    'get_db',
    'SessionLocal',
    'check_database_connection',
    'cache',
    'RedisCache',
    'HeatStressCalculator',
    'DroughtIndicator',
    'ExtremeEventAnalyzer',
    'DATABASE_AVAILABLE',
    'CACHE_AVAILABLE'
]
