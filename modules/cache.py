"""
Redis caching layer for high-performance data caching
"""
import json
import redis
from typing import Optional, Any
from datetime import timedelta
from config import Config

class RedisCache:
    """Redis cache manager for climate data"""
    
    def __init__(self):
        self.redis_client = None
        self.connected = False
        self._connect()
    
    def _connect(self):
        """Establish connection to Redis"""
        try:
            self.redis_client = redis.Redis(
                host=Config.REDIS_HOST,
                port=Config.REDIS_PORT,
                db=Config.REDIS_DB,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5,
                retry_on_timeout=True,
                health_check_interval=30
            )
            # Test connection
            self.redis_client.ping()
            self.connected = True
            print("✅ Redis cache connected")
        except Exception as e:
            print(f"❌ Redis connection failed: {e}")
            print("   Running without cache")
            self.connected = False
    
    def _make_key(self, *parts) -> str:
        """Create a namespaced cache key"""
        return Config.CACHE_PREFIX + ':'.join(str(p) for p in parts)
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self.connected:
            return None
        
        try:
            full_key = self._make_key(key)
            value = self.redis_client.get(full_key)
            
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            print(f"Cache get error: {e}")
            return None
    
    def set(self, key: str, value: Any, ttl: int = None) -> bool:
        """Set value in cache with optional TTL"""
        if not self.connected:
            return False
        
        try:
            full_key = self._make_key(key)
            serialized = json.dumps(value)
            
            if ttl:
                self.redis_client.setex(full_key, ttl, serialized)
            else:
                self.redis_client.set(full_key, serialized)
            
            return True
        except Exception as e:
            print(f"Cache set error: {e}")
            return False
    
    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        if not self.connected:
            return False
        
        try:
            full_key = self._make_key(key)
            self.redis_client.delete(full_key)
            return True
        except Exception as e:
            print(f"Cache delete error: {e}")
            return False
    
    def delete_pattern(self, pattern: str) -> int:
        """Delete all keys matching pattern"""
        if not self.connected:
            return 0
        
        try:
            full_pattern = self._make_key(pattern)
            keys = self.redis_client.keys(full_pattern)
            
            if keys:
                return self.redis_client.delete(*keys)
            return 0
        except Exception as e:
            print(f"Cache delete pattern error: {e}")
            return 0
    
    def exists(self, key: str) -> bool:
        """Check if key exists in cache"""
        if not self.connected:
            return False
        
        try:
            full_key = self._make_key(key)
            return self.redis_client.exists(full_key) > 0
        except Exception as e:
            print(f"Cache exists error: {e}")
            return False
    
    def clear_all(self) -> bool:
        """Clear all cache entries (use with caution)"""
        if not self.connected:
            return False
        
        try:
            pattern = Config.CACHE_PREFIX + '*'
            keys = self.redis_client.keys(pattern)
            
            if keys:
                self.redis_client.delete(*keys)
            
            return True
        except Exception as e:
            print(f"Cache clear error: {e}")
            return False
    
    # Specific cache methods for climate data
    def get_climate_data(self, location_id: str, variable: str, date: str, aggregation: str = 'monthly') -> Optional[float]:
        """Get cached climate data"""
        key = f'climate:{location_id}:{variable}:{date}:{aggregation}'
        return self.get(key)
    
    def set_climate_data(self, location_id: str, variable: str, date: str, value: float, aggregation: str = 'monthly', ttl: int = None) -> bool:
        """Cache climate data"""
        key = f'climate:{location_id}:{variable}:{date}:{aggregation}'
        return self.set(key, value, ttl or Config.CACHE_TIMEOUT)
    
    def get_timeseries(self, location_id: str, variable: str, start_date: str, end_date: str, aggregation: str = 'monthly') -> Optional[list]:
        """Get cached timeseries data"""
        key = f'timeseries:{location_id}:{variable}:{start_date}:{end_date}:{aggregation}'
        return self.get(key)
    
    def set_timeseries(self, location_id: str, variable: str, start_date: str, end_date: str, data: list, aggregation: str = 'monthly', ttl: int = None) -> bool:
        """Cache timeseries data"""
        key = f'timeseries:{location_id}:{variable}:{start_date}:{end_date}:{aggregation}'
        return self.set(key, data, ttl or Config.CACHE_TIMEOUT)
    
    def get_map_data(self, variable: str, date: str, level: int = 1) -> Optional[dict]:
        """Get cached map data"""
        key = f'map:{variable}:{date}:{level}'
        return self.get(key)
    
    def set_map_data(self, variable: str, date: str, data: dict, level: int = 1, ttl: int = None) -> bool:
        """Cache map data"""
        key = f'map:{variable}:{date}:{level}'
        return self.set(key, data, ttl or Config.CACHE_TIMEOUT)
    
    def get_boundaries(self, level: int = 1) -> Optional[dict]:
        """Get cached boundaries"""
        key = f'boundaries:{level}'
        return self.get(key)
    
    def set_boundaries(self, level: int, data: dict, ttl: int = None) -> bool:
        """Cache boundaries (long TTL since they rarely change)"""
        key = f'boundaries:{level}'
        # Boundaries don't change often, cache for 1 week
        return self.set(key, data, ttl or 604800)
    
    def invalidate_climate_data(self, location_id: str = None, variable: str = None):
        """Invalidate climate data cache"""
        if location_id and variable:
            pattern = f'climate:{location_id}:{variable}:*'
        elif location_id:
            pattern = f'climate:{location_id}:*'
        elif variable:
            pattern = f'climate:*:{variable}:*'
        else:
            pattern = 'climate:*'
        
        return self.delete_pattern(pattern)
    
    def get_stats(self) -> dict:
        """Get cache statistics"""
        if not self.connected:
            return {
                'connected': False,
                'keys': 0
            }
        
        try:
            info = self.redis_client.info()
            pattern = Config.CACHE_PREFIX + '*'
            keys = self.redis_client.keys(pattern)
            
            return {
                'connected': True,
                'keys': len(keys),
                'used_memory': info.get('used_memory_human', 'N/A'),
                'total_commands_processed': info.get('total_commands_processed', 0),
                'hits': info.get('keyspace_hits', 0),
                'misses': info.get('keyspace_misses', 0)
            }
        except Exception as e:
            print(f"Cache stats error: {e}")
            return {'connected': False, 'error': str(e)}


# Global cache instance
cache = RedisCache()

