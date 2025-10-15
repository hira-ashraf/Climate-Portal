import sqlite3
import json
import time
from functools import wraps
from datetime import datetime
from config import Config

def create_database():
    conn = sqlite3.connect(Config.DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS administrative_units (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            level INTEGER NOT NULL,
            parent_id TEXT,
            geometry TEXT,
            properties TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS climate_cache (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            location_id TEXT NOT NULL,
            variable TEXT NOT NULL,
            date TEXT NOT NULL,
            value REAL,
            aggregation TEXT DEFAULT 'monthly',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(location_id, variable, date, aggregation)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ml_predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            location_id TEXT NOT NULL,
            variable TEXT NOT NULL,
            prediction_date TEXT NOT NULL,
            predicted_value REAL,
            lower_bound REAL,
            upper_bound REAL,
            model_type TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS download_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT NOT NULL,
            request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_climate_cache 
        ON climate_cache(location_id, variable, date)
    ''')
    
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_download_requests 
        ON download_requests(ip_address, request_time)
    ''')
    
    conn.commit()
    conn.close()
    print("Database initialized successfully")

def insert_sample_boundaries():
    conn = sqlite3.connect(Config.DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM administrative_units')
    count = cursor.fetchone()[0]
    
    if count > 0:
        conn.close()
        return
    
    provinces = [
        {
            'id': 'punjab',
            'name': 'Punjab',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [[
                    [69.5, 28.5], [75.5, 28.5], [75.5, 34.0], [69.5, 34.0], [69.5, 28.5]
                ]]
            }
        },
        {
            'id': 'sindh',
            'name': 'Sindh',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [[
                    [66.5, 23.7], [71.0, 23.7], [71.0, 28.5], [66.5, 28.5], [66.5, 23.7]
                ]]
            }
        },
        {
            'id': 'kpk',
            'name': 'Khyber Pakhtunkhwa',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [[
                    [69.0, 31.5], [74.0, 31.5], [74.0, 36.0], [69.0, 36.0], [69.0, 31.5]
                ]]
            }
        },
        {
            'id': 'balochistan',
            'name': 'Balochistan',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [[
                    [61.0, 24.5], [70.0, 24.5], [70.0, 31.5], [61.0, 31.5], [61.0, 24.5]
                ]]
            }
        },
        {
            'id': 'gb',
            'name': 'Gilgit-Baltistan',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [[
                    [72.0, 35.0], [77.5, 35.0], [77.5, 37.0], [72.0, 37.0], [72.0, 35.0]
                ]]
            }
        },
        {
            'id': 'ajk',
            'name': 'Azad Kashmir',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [[
                    [73.0, 33.5], [74.5, 33.5], [74.5, 35.0], [73.0, 35.0], [73.0, 33.5]
                ]]
            }
        }
    ]
    
    for province in provinces:
        cursor.execute('''
            INSERT INTO administrative_units (id, name, level, geometry, properties)
            VALUES (?, ?, 1, ?, ?)
        ''', (
            province['id'],
            province['name'],
            json.dumps(province['geometry']),
            json.dumps({'type': 'province'})
        ))
    
    conn.commit()
    conn.close()
    print(f"Inserted {len(provinces)} sample boundaries")

def rate_limit(max_requests=5, window=3600):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            from flask import request, jsonify
            
            ip_address = request.remote_addr
            current_time = datetime.now()
            window_start = datetime.fromtimestamp(current_time.timestamp() - window)
            
            conn = sqlite3.connect(Config.DATABASE_PATH)
            cursor = conn.cursor()
            
            cursor.execute('''
                DELETE FROM download_requests
                WHERE request_time < ?
            ''', (window_start,))
            
            cursor.execute('''
                SELECT COUNT(*) FROM download_requests
                WHERE ip_address = ? AND request_time >= ?
            ''', (ip_address, window_start))
            
            request_count = cursor.fetchone()[0]
            
            if request_count >= max_requests:
                conn.close()
                return jsonify({
                    'error': 'Rate limit exceeded',
                    'message': f'Maximum {max_requests} requests per hour allowed'
                }), 429
            
            cursor.execute('''
                INSERT INTO download_requests (ip_address, request_time)
                VALUES (?, ?)
            ''', (ip_address, current_time))
            
            conn.commit()
            conn.close()
            
            return func(*args, **kwargs)
        
        return wrapper
    return decorator
