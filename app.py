# EARTH ENGINE INITIALIZATION
import sys

# Fix Windows console encoding for Unicode characters
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

import ee
from config import Config

def initialize_earth_engine():
    """Initialize Earth Engine with multiple authentication methods"""
    
    # Quick check: Skip if no credentials
    import os
    if not Config.GEE_PROJECT_ID and not os.path.exists(os.path.expanduser('~/.config/earthengine/credentials')):
        print("=" * 60)
        print("[INFO] GEE NOT CONFIGURED - Running with MOCK DATA")
        print("=" * 60)
        print("To use real Earth Engine data:")
        print("1. Run: python authenticate_gee.py")
        print("2. Or set GEE credentials in .env file")
        print("=" * 60)
        return False
    
    # Method 1: Try service account authentication (for production)
    if Config.GEE_SERVICE_ACCOUNT and Config.GEE_PRIVATE_KEY:
        try:
            import json
            credentials = ee.ServiceAccountCredentials(
                Config.GEE_SERVICE_ACCOUNT,
                key_data=Config.GEE_PRIVATE_KEY
            )
            ee.Initialize(credentials, project=Config.GEE_PROJECT_ID)
            print("[OK] Earth Engine initialized with service account!")
            return True
        except Exception as e:
            print(f"[WARN] Service account initialization failed: {e}")
    
    # Method 2: Try personal account authentication (for development)
    try:
        if Config.GEE_PROJECT_ID:
            ee.Initialize(project=Config.GEE_PROJECT_ID)
        else:
            ee.Initialize()
        print("[OK] Earth Engine initialized with personal account!")
        return True
    except Exception as e:
        print(f"[WARN] Personal account initialization failed: {e}")
    
    # Method 3: Fallback to mock data
    print("=" * 60)
    print("[INFO] Running with MOCK DATA")
    print("=" * 60)
    print("To use real Earth Engine data:")
    print("1. Run: python authenticate_gee.py")
    print("2. Or set GEE credentials in .env file")
    print("=" * 60)
    return False

# Initialize Earth Engine
GEE_INITIALIZED = initialize_earth_engine()

# FASTAPI IMPORTS
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
import io
import csv
import pandas as pd

from modules import ClimateDataFetcher, SpatialProcessor, ClimateForecaster, GeeMapHelper
from modules.utils import create_database, insert_sample_boundaries, rate_limit
from modules.cache import cache
from modules.climate_indices import HeatStressCalculator, DroughtIndicator, ExtremeEventAnalyzer

# Create FastAPI app
app = FastAPI(
    title="Climate Information Portal of Pakistan",
    description="Interactive climate data visualization and analysis platform with advanced indices",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configure templates
templates = Jinja2Templates(directory="templates")

# Initialize modules
create_database()
insert_sample_boundaries()

data_fetcher = ClimateDataFetcher()
spatial_processor = SpatialProcessor()
forecaster = ClimateForecaster()
geemap_helper = GeeMapHelper(data_fetcher)

# Pydantic models for request validation
class DownloadRequest(BaseModel):
    location: dict
    variables: List[str]
    start_date: str
    end_date: str
    aggregation: str
    format: str

class CompareRequest(BaseModel):
    locations: List[str]
    variable: str
    time_period: str

# HTML ROUTES - DISABLED (React frontend is used instead)
# @app.get("/", response_class=HTMLResponse)
# async def index(request: Request):
#     """Main dashboard page"""
#     return templates.TemplateResponse("index.html", {"request": request})

# @app.get("/map", response_class=HTMLResponse)
# async def map_viewer(
#     request: Request,
#     variable: str = "temperature",
#     date: Optional[str] = None
# ):
#     """Interactive map viewer page"""
#     if date is None:
#         date = datetime.now().strftime('%Y-%m')
#     
#     try:
#         year, month = map(int, date.split('-'))
#     except:
#         year, month = datetime.now().year, datetime.now().month
#     
#     climate_map = geemap_helper.create_climate_map(variable, year, month)
#     map_html = geemap_helper.to_html(climate_map)
#     
#     return templates.TemplateResponse(
#         "map_viewer.html",
#         {
#             "request": request,
#             "map_html": map_html,
#             "variable": variable,
#             "date": date
#         }
#     )

# @app.get("/timeseries", response_class=HTMLResponse)
# async def timeseries(request: Request):
#     """Time series analysis page"""
#     return templates.TemplateResponse("time_series.html", {"request": request})

# @app.get("/forecast", response_class=HTMLResponse)
# async def forecast(request: Request):
#     """Climate forecast page"""
#     return templates.TemplateResponse("forecast.html", {"request": request})

# @app.get("/download", response_class=HTMLResponse)
# async def download(request: Request):
#     """Data download page"""
#     return templates.TemplateResponse("download.html", {"request": request})

# @app.get("/about", response_class=HTMLResponse)
# async def about(request: Request):
#     """About page"""
#     return templates.TemplateResponse("about.html", {"request": request})

# API ROUTES
@app.get("/api/map-data")
async def get_map_data(
    variable: str = "temperature",
    date: Optional[str] = None,
    level: int = 1
):
    """Get climate map data as GeoJSON (with Redis caching)"""
    if date is None:
        date = datetime.now().strftime('%Y-%m')
    
    try:
        year, month = map(int, date.split('-'))
    except:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM")
    
    # Try cache first
    cached_data = cache.get_map_data(variable, date, level)
    if cached_data:
        return JSONResponse(content=cached_data)
    
    boundaries = spatial_processor.get_boundaries(level)
    
    if data_fetcher.initialized:
        try:
            image = data_fetcher.fetch_era5_for_map(variable, year, month)
            
            ee_boundaries = ee.FeatureCollection([
                ee.Feature(ee.Geometry(feat['geometry']), feat['properties'])
                for feat in boundaries['features']
            ])
            
            zonal_fc = data_fetcher.calculate_zonal_stats(image, ee_boundaries, variable)
            zonal_info = zonal_fc.getInfo()
            
            climate_data = []
            for feat in zonal_info['features']:
                var_config = Config.CLIMATE_VARIABLES.get(variable, {})
                gee_band = var_config.get('gee_band', 'temperature_2m')
                value = feat['properties'].get(gee_band)
                
                if value is not None:
                    value = value * var_config.get('scale_factor', 1) + var_config.get('offset', 0)
                
                climate_data.append({
                    'name': feat['properties'].get('name'),
                    'value': value
                })
        except Exception as e:
            print(f"Error fetching real data: {e}")
            climate_data = data_fetcher.generate_mock_zonal_stats(variable)
    else:
        climate_data = data_fetcher.generate_mock_zonal_stats(variable)
    
    result = spatial_processor.add_climate_values_to_geojson(
        boundaries, climate_data, variable
    )
    
    # Cache the result
    cache.set_map_data(variable, date, result, level)
    
    return JSONResponse(content=result)

@app.get("/api/boundaries")
async def get_boundaries(level: int = 1):
    """Get administrative boundaries"""
    boundaries = spatial_processor.get_boundaries(level)
    return JSONResponse(content=boundaries)

@app.get("/api/timeseries")
async def get_timeseries(
    location_id: str = "punjab",
    variable: str = "temperature",
    start: str = "2020-01-01",
    end: Optional[str] = None,
    aggregation: str = "monthly"
):
    """Get time series data for a location (with Redis caching)"""
    if end is None:
        end = datetime.now().strftime('%Y-%m-%d')
    
    # Try cache first
    cached_data = cache.get_timeseries(location_id, variable, start, end, aggregation)
    if cached_data:
        return JSONResponse(content=cached_data)
    
    if data_fetcher.initialized:
        try:
            pakistan_center = ee.Geometry.Point([69.3451, 30.3753])
            data = data_fetcher.extract_timeseries(
                variable, start, end, pakistan_center, aggregation, location_id
            )
        except Exception as e:
            print(f"Error fetching real timeseries: {e}")
            data = data_fetcher.generate_mock_timeseries(variable, start, end)
    else:
        data = data_fetcher.generate_mock_timeseries(variable, start, end)
    
    result = {
        'location': location_id,
        'variable': variable,
        'data': data,
        'aggregation': aggregation
    }
    
    # Cache the result
    cache.set_timeseries(location_id, variable, start, end, result, aggregation)
    
    return JSONResponse(content=result)

@app.post("/api/compare")
async def compare_regions(request: CompareRequest):
    """Compare climate data across multiple regions"""
    try:
        start_date, end_date = request.time_period.split(' to ')
    except:
        raise HTTPException(status_code=400, detail="Invalid time period format")
    
    comparison_data = []
    
    for location in request.locations:
        location_timeseries = data_fetcher.generate_mock_timeseries(
            request.variable, start_date, end_date
        )
        values = [d['value'] for d in location_timeseries]
        
        comparison_data.append({
            'location': location,
            'mean': round(sum(values) / len(values), 2) if values else 0,
            'min': round(min(values), 2) if values else 0,
            'max': round(max(values), 2) if values else 0,
            'timeseries': location_timeseries
        })
    
    return JSONResponse(content={
        'variable': request.variable,
        'time_period': request.time_period,
        'comparison': comparison_data
    })

@app.get("/api/forecast")
async def get_forecast(
    location_id: str = "punjab",
    variable: str = "temperature",
    horizon: str = "monthly"
):
    """Get climate forecast using ML models
    
    Args:
        location_id: Location identifier
        variable: Climate variable to forecast
        horizon: Forecast horizon (monthly, seasonal, annual)
    """
    historical_data = data_fetcher.generate_mock_timeseries(
        variable, '2023-01-01', datetime.now().strftime('%Y-%m-%d')
    )
    
    forecast_data = forecaster.predict_future(variable, historical_data, months_ahead=3)
    model_info = forecaster.get_model_info(variable)
    
    return JSONResponse(content={
        'location': location_id,
        'variable': variable,
        'forecast': forecast_data,
        'model_info': model_info
    })

@app.get("/api/statistics/summary")
async def get_statistics(period: str = "current_month"):
    """Get summary statistics"""
    summary = {
        'period': period,
        'national_avg_temp': 28.5,
        'national_avg_temp_normal': 27.2,
        'total_rainfall': 45.3,
        'total_rainfall_normal': 52.1,
        'hottest_district': {'name': 'Jacobabad', 'value': 42.3},
        'coldest_district': {'name': 'Murree', 'value': 18.5},
        'wettest_district': {'name': 'Lahore', 'value': 125.4},
        'driest_district': {'name': 'Quetta', 'value': 8.2},
        'historical_records': {
            'warmest_year': {'year': 2023, 'temp': 29.8},
            'wettest_monsoon': {'year': 2022, 'rainfall': 1250.5},
            'longest_dry_spell': {'days': 145, 'year': 2021}
        }
    }
    
    return JSONResponse(content=summary)

@app.post("/api/download")
@rate_limit(max_requests=5, window=3600)
async def download_data(request: DownloadRequest):
    """Download climate data in CSV or JSON format"""
    climate_data = []
    
    for variable in request.variables:
        if data_fetcher.initialized:
            try:
                pakistan_center = ee.Geometry.Point([69.3451, 30.3753])
                timeseries = data_fetcher.extract_timeseries(
                    variable,
                    request.start_date,
                    request.end_date,
                    pakistan_center,
                    request.aggregation,
                    request.location.get('id', 'unknown')
                )
            except Exception as e:
                print(f"Error fetching real data for download: {e}")
                var_timeseries = data_fetcher.generate_mock_timeseries(
                    variable, request.start_date, request.end_date
                )
        else:
            var_timeseries = data_fetcher.generate_mock_timeseries(
                variable, request.start_date, request.end_date
            )
        
        for entry in var_timeseries:
            climate_data.append({
                'date': entry['date'],
                'variable': variable,
                'value': entry['value'],
                'location': request.location.get('id', 'unknown'),
                'aggregation': request.aggregation,
                'units': Config.CLIMATE_VARIABLES.get(variable, {}).get('unit', '')
            })
    
    if request.format == 'csv':
        output = io.StringIO()
        writer = csv.DictWriter(
            output,
            fieldnames=['date', 'variable', 'value', 'location', 'aggregation', 'units']
        )
        writer.writeheader()
        writer.writerows(climate_data)
        
        output.seek(0)
        
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename=climate_data_{request.start_date}_{request.end_date}.csv"
            }
        )
    elif request.format == 'json':
        return JSONResponse(content=climate_data)
    else:
        raise HTTPException(status_code=400, detail="Unsupported format")

@app.get("/api/config")
async def get_config():
    """Get application configuration"""
    return JSONResponse(content={
        'center': Config.PAKISTAN_CENTER,
        'bounds': Config.PAKISTAN_BOUNDS,
        'variables': Config.CLIMATE_VARIABLES
    })

# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    print("=" * 60)
    print("FastAPI Climate Portal Started!")
    print("=" * 60)
    print(f"GEE Initialized: {GEE_INITIALIZED}")
    print("API Documentation: http://localhost:8000/api/docs")
    print("=" * 60)

@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    print("Shutting down Climate Portal...")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    cache_stats = cache.get_stats()
    return {
        "status": "healthy",
        "gee_initialized": GEE_INITIALIZED,
        "redis_connected": cache.connected,
        "cache_stats": cache_stats,
        "version": "2.0.0"
    }

# ============================================
# NEW: ADVANCED CLIMATE INDICES ENDPOINTS
# ============================================

@app.get("/api/indices/heat-stress")
async def get_heat_stress_index(
    location_id: str = "punjab",
    date: Optional[str] = None,
    index_type: str = "heat_index"  # heat_index, wbgt, humidex
):
    """
    Calculate heat stress indices
    
    Args:
        location_id: Location identifier
        date: Date in YYYY-MM format (defaults to current month)
        index_type: Type of heat stress index (heat_index, wbgt, humidex)
    
    Returns:
        Heat stress index value and classification
    """
    if date is None:
        date = datetime.now().strftime('%Y-%m')
    
    # Check cache
    cache_key = f'heat_stress:{location_id}:{date}:{index_type}'
    cached_result = cache.get(cache_key)
    if cached_result:
        return JSONResponse(content=cached_result)
    
    # Mock data for demonstration (in production, fetch real data)
    temperature = 35.0  # °C
    humidity = 65.0     # %
    wind_speed = 2.5    # m/s
    solar_radiation = 800  # W/m²
    
    heat_calc = HeatStressCalculator()
    
    if index_type == "heat_index":
        value = heat_calc.heat_index(temperature, humidity)
        classification = heat_calc.classify_heat_stress(value)
    elif index_type == "wbgt":
        value = heat_calc.wet_bulb_globe_temperature(
            temperature, humidity, wind_speed, solar_radiation
        )
        classification = {"level": "moderate" if value < 28 else "high" if value < 32 else "extreme"}
    elif index_type == "humidex":
        value = heat_calc.humidex(temperature, humidity)
        classification = {"level": "comfortable" if value < 30 else "some_discomfort" if value < 40 else "great_discomfort"}
    else:
        raise HTTPException(status_code=400, detail="Invalid index_type")
    
    result = {
        "location": location_id,
        "date": date,
        "index_type": index_type,
        "value": round(value, 2),
        "classification": classification,
        "inputs": {
            "temperature": temperature,
            "humidity": humidity,
            "wind_speed": wind_speed if index_type == "wbgt" else None,
            "solar_radiation": solar_radiation if index_type == "wbgt" else None
        }
    }
    
    # Cache for 1 hour
    cache.set(cache_key, result, ttl=3600)
    
    return JSONResponse(content=result)

@app.get("/api/indices/drought")
async def get_drought_index(
    location_id: str = "punjab",
    start_date: str = "2020-01-01",
    end_date: Optional[str] = None,
    index_type: str = "spi",  # spi, spei, palmer_drought
    timescale: int = 3  # months
):
    """
    Calculate drought indices
    
    Args:
        location_id: Location identifier
        start_date: Start date in YYYY-MM-DD format
        end_date: End date (defaults to current date)
        index_type: Type of drought index (spi, spei, palmer_drought)
        timescale: Accumulation period in months (1, 3, 6, 12, 24)
    
    Returns:
        Drought index timeseries and current classification
    """
    if end_date is None:
        end_date = datetime.now().strftime('%Y-%m-%d')
    
    # Check cache
    cache_key = f'drought:{location_id}:{start_date}:{end_date}:{index_type}:{timescale}'
    cached_result = cache.get(cache_key)
    if cached_result:
        return JSONResponse(content=cached_result)
    
    # Mock precipitation data for demonstration
    import numpy as np
    dates = pd.date_range(start_date, end_date, freq='MS')
    precipitation = np.random.gamma(2, 30, len(dates))  # Realistic precipitation distribution
    evapotranspiration = np.random.uniform(80, 150, len(dates))
    
    drought_calc = DroughtIndicator()
    
    if index_type == "spi":
        values = drought_calc.standardized_precipitation_index(precipitation, timescale)
    elif index_type == "spei":
        values = drought_calc.standardized_precipitation_evapotranspiration_index(
            precipitation, evapotranspiration, timescale
        )
    elif index_type == "palmer_drought":
        temperature = np.random.uniform(20, 35, len(dates))
        values = drought_calc.palmer_drought_severity_index(temperature, precipitation)
    else:
        raise HTTPException(status_code=400, detail="Invalid index_type")
    
    # Create timeseries  
    drought_timeseries = []
    for i, date in enumerate(dates):
        if not np.isnan(values[i]):
            # Classify drought severity
            if values[i] >= 2:
                severity = "extremely_wet"
            elif values[i] >= 1.5:
                severity = "very_wet"
            elif values[i] >= 1:
                severity = "moderately_wet"
            elif values[i] >= -1:
                severity = "normal"
            elif values[i] >= -1.5:
                severity = "moderate_drought"
            elif values[i] >= -2:
                severity = "severe_drought"
            else:
                severity = "extreme_drought"
            
            drought_timeseries.append({
                "date": date.strftime('%Y-%m-%d'),
                "value": round(float(values[i]), 2),
                "severity": severity
            })
    
    result = {
        "location": location_id,
        "index_type": index_type,
        "timescale": timescale,
        "start_date": start_date,
        "end_date": end_date,
        "current_value": round(float(values[-1]), 2) if len(values) > 0 and not np.isnan(values[-1]) else None,
        "current_severity": drought_timeseries[-1]["severity"] if drought_timeseries else "unknown",
        "timeseries": drought_timeseries
    }
    
    # Cache for 6 hours
    cache.set(cache_key, result, ttl=21600)
    
    return JSONResponse(content=result)

@app.get("/api/indices/extreme-events")
async def get_extreme_events(
    location_id: str = "punjab",
    start_date: str = "2020-01-01",
    end_date: Optional[str] = None,
    event_type: str = "temperature"  # temperature, precipitation, wind_speed
):
    """
    Calculate extreme event statistics
    
    Args:
        location_id: Location identifier
        start_date: Start date
        end_date: End date
        event_type: Type of extreme event
    
    Returns:
        Extreme event statistics including frequency, intensity, and return periods
    """
    if end_date is None:
        end_date = datetime.now().strftime('%Y-%m-%d')
    
    # Check cache
    cache_key = f'extreme_events:{location_id}:{start_date}:{end_date}:{event_type}'
    cached_result = cache.get(cache_key)
    if cached_result:
        return JSONResponse(content=cached_result)
    
    # Mock data for demonstration
    import numpy as np
    dates = pd.date_range(start_date, end_date, freq='D')
    
    if event_type == "temperature":
        values = np.random.normal(28, 5, len(dates))
        thresholds = Config.EXTREME_THRESHOLDS['temperature']
    elif event_type == "precipitation":
        values = np.random.gamma(2, 5, len(dates))
        thresholds = Config.EXTREME_THRESHOLDS['precipitation']
    elif event_type == "wind_speed":
        values = np.random.gamma(3, 2, len(dates))
        thresholds = Config.EXTREME_THRESHOLDS['wind_speed']
    else:
        raise HTTPException(status_code=400, detail="Invalid event_type")
    
    extreme_calc = ExtremeEventAnalyzer()
    
    # Detect extreme events
    if event_type == "temperature":
        hot_days = extreme_calc.hot_days(values, thresholds['hot'])
        very_hot_days = extreme_calc.hot_days(values, thresholds['very_hot'])
        cold_days = extreme_calc.cold_days(values, thresholds['cold'])
        
        extreme_events = [
            {"type": "hot_days", "count": hot_days, "threshold": thresholds['hot']},
            {"type": "very_hot_days", "count": very_hot_days, "threshold": thresholds['very_hot']},
            {"type": "cold_days", "count": cold_days, "threshold": thresholds['cold']}
        ]
    elif event_type == "precipitation":
        heavy_rain = extreme_calc.heavy_precipitation_days(values, thresholds['heavy'])
        very_heavy_rain = extreme_calc.heavy_precipitation_days(values, thresholds['very_heavy'])
        extreme_rain = extreme_calc.heavy_precipitation_days(values, thresholds['extreme'])
        
        extreme_events = [
            {"type": "heavy_rain_days", "count": heavy_rain, "threshold": thresholds['heavy']},
            {"type": "very_heavy_rain_days", "count": very_heavy_rain, "threshold": thresholds['very_heavy']},
            {"type": "extreme_rain_days", "count": extreme_rain, "threshold": thresholds['extreme']}
        ]
    else:  # wind_speed
        strong_wind = extreme_calc.strong_wind_days(values, thresholds['strong'])
        gale = extreme_calc.strong_wind_days(values, thresholds['gale'])
        storm = extreme_calc.strong_wind_days(values, thresholds['storm'])
        
        extreme_events = [
            {"type": "strong_wind_days", "count": strong_wind, "threshold": thresholds['strong']},
            {"type": "gale_days", "count": gale, "threshold": thresholds['gale']},
            {"type": "storm_days", "count": storm, "threshold": thresholds['storm']}
        ]
    
    # Calculate return periods for extreme values
    return_periods = extreme_calc.calculate_return_periods(values, [2, 5, 10, 20, 50, 100])
    
    result = {
        "location": location_id,
        "event_type": event_type,
        "start_date": start_date,
        "end_date": end_date,
        "total_days": len(dates),
        "extreme_events": extreme_events,
        "return_periods": return_periods,
        "statistics": {
            "mean": round(float(np.mean(values)), 2),
            "max": round(float(np.max(values)), 2),
            "min": round(float(np.min(values)), 2),
            "std": round(float(np.std(values)), 2),
            "percentile_95": round(float(np.percentile(values, 95)), 2),
            "percentile_99": round(float(np.percentile(values, 99)), 2)
        }
    }
    
    # Cache for 12 hours
    cache.set(cache_key, result, ttl=43200)
    
    return JSONResponse(content=result)

@app.get("/api/cache/stats")
async def get_cache_statistics():
    """Get Redis cache statistics"""
    return JSONResponse(content=cache.get_stats())

@app.post("/api/cache/clear")
async def clear_cache(pattern: Optional[str] = None):
    """Clear cache (use with caution)"""
    if pattern:
        deleted = cache.delete_pattern(pattern)
        return JSONResponse(content={
            "success": True,
            "deleted_keys": deleted,
            "pattern": pattern
        })
    else:
        cache.clear_all()
        return JSONResponse(content={
            "success": True,
            "message": "All cache cleared"
        })

# ============================================
# SERVE FRONTEND STATIC FILES
# ============================================

# Check if frontend build exists
frontend_dist = Path(__file__).parent / "frontend" / "dist"

if frontend_dist.exists():
    # Mount static assets (JS, CSS, images)
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")
    
    # Serve index.html for all non-API routes (SPA routing)
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve frontend for all non-API routes"""
        # Don't intercept API routes
        if full_path.startswith("api/") or full_path.startswith("health"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        
        # Serve index.html for all other routes
        index_file = frontend_dist / "index.html"
        if index_file.exists():
            return FileResponse(str(index_file))
        else:
            raise HTTPException(status_code=404, detail="Frontend not built")
else:
    print("\n" + "=" * 60)
    print("⚠️  FRONTEND NOT BUILT")
    print("=" * 60)
    print("To build frontend:")
    print("1. cd frontend")
    print("2. npm install")
    print("3. npm run build")
    print("=" * 60 + "\n")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
