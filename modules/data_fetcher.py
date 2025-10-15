import os
import random
from datetime import datetime, timedelta
from config import Config

class ClimateDataFetcher:
    def __init__(self):
        self.initialized = False
        self.ee = None
        
        if Config.GEE_PROJECT_ID:
            try:
                import ee
                self.ee = ee
                
                if Config.GEE_SERVICE_ACCOUNT and Config.GEE_PRIVATE_KEY:
                    import json
                    import tempfile
                    
                    key_data = json.loads(Config.GEE_PRIVATE_KEY)
                    
                    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
                        json.dump(key_data, f)
                        key_file = f.name
                    
                    credentials = ee.ServiceAccountCredentials(Config.GEE_SERVICE_ACCOUNT, key_file)
                    ee.Initialize(credentials)
                    print("Google Earth Engine initialized with service account")
                else:
                    ee.Initialize(project=Config.GEE_PROJECT_ID)
                    print("Google Earth Engine initialized with project ID")
                
                self.initialized = True
            except Exception as e:
                print(f"Failed to initialize Google Earth Engine: {e}")
                print("Falling back to mock data")
    
    def fetch_era5_for_map(self, variable, year, month):
        if not self.initialized:
            return None
        
        var_config = Config.CLIMATE_VARIABLES.get(variable, {})
        gee_band = var_config.get('gee_band', 'temperature_2m')
        
        start_date = f'{year}-{month:02d}-01'
        if month == 12:
            end_date = f'{year + 1}-01-01'
        else:
            end_date = f'{year}-{month + 1:02d}-01'
        
        image_collection = self.ee.ImageCollection(Config.ERA5_MONTHLY_DATASET) \
            .filterDate(start_date, end_date) \
            .select(gee_band)
        
        image = image_collection.mean()
        
        return image
    
    def calculate_zonal_stats(self, image, boundaries, variable):
        var_config = Config.CLIMATE_VARIABLES.get(variable, {})
        gee_band = var_config.get('gee_band', 'temperature_2m')
        
        def compute_mean(feature):
            mean_value = image.reduceRegion(
                reducer=self.ee.Reducer.mean(),
                geometry=feature.geometry(),
                scale=1000
            ).get(gee_band)
            
            return feature.set(gee_band, mean_value)
        
        zonal_fc = boundaries.map(compute_mean)
        return zonal_fc
    
    def extract_timeseries(self, variable, start_date, end_date, geometry, aggregation='monthly'):
        if not self.initialized:
            return self.generate_mock_timeseries(variable, start_date, end_date)
        
        var_config = Config.CLIMATE_VARIABLES.get(variable, {})
        gee_band = var_config.get('gee_band', 'temperature_2m')
        agg_config = Config.AGGREGATION_TYPES.get(aggregation, Config.AGGREGATION_TYPES['monthly'])
        dataset = agg_config['dataset']
        scale = agg_config['scale']
        
        image_collection = self.ee.ImageCollection(dataset) \
            .filterDate(start_date, end_date) \
            .select(gee_band)
        
        if aggregation == 'seasonal':
            image_collection = self._aggregate_seasonal(image_collection, gee_band)
        elif aggregation == 'annual':
            image_collection = self._aggregate_annual(image_collection, gee_band)
        
        def extract_value(image):
            date = image.date().format('YYYY-MM-dd')
            value = image.reduceRegion(
                reducer=self.ee.Reducer.mean(),
                geometry=geometry,
                scale=scale
            ).get(gee_band)
            
            scaled_value = self.ee.Number(value).multiply(var_config.get('scale_factor', 1)) \
                .add(var_config.get('offset', 0))
            
            return self.ee.Feature(None, {
                'date': date,
                'value': scaled_value
            })
        
        timeseries_fc = image_collection.map(extract_value)
        timeseries_info = timeseries_fc.getInfo()
        
        data = []
        for feat in timeseries_info['features']:
            props = feat['properties']
            data.append({
                'date': props['date'],
                'value': round(props['value'], 2) if props['value'] is not None else None
            })
        
        return data
    
    def _aggregate_seasonal(self, collection, band):
        seasons = {
            'Winter': [12, 1, 2],
            'Spring': [3, 4, 5],
            'Summer': [6, 7, 8],
            'Fall': [9, 10, 11]
        }
        
        seasonal_images = []
        for season_name, months in seasons.items():
            season_collection = collection.filter(
                self.ee.Filter.calendarRange(months[0], months[-1], 'month')
            )
            if season_collection.size().getInfo() > 0:
                seasonal_img = season_collection.mean().set('system:time_start', 
                    season_collection.first().get('system:time_start'))
                seasonal_images.append(seasonal_img)
        
        return self.ee.ImageCollection(seasonal_images)
    
    def _aggregate_annual(self, collection, band):
        years = collection.aggregate_array('system:time_start').map(
            lambda t: self.ee.Date(t).get('year')
        ).distinct()
        
        def create_annual_image(year):
            annual = collection.filter(
                self.ee.Filter.calendarRange(year, year, 'year')
            ).mean()
            return annual.set('system:time_start', self.ee.Date.fromYMD(year, 1, 1).millis())
        
        annual_collection = self.ee.ImageCollection(years.map(create_annual_image))
        return annual_collection
    
    def generate_mock_zonal_stats(self, variable):
        provinces = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir']
        
        value_ranges = {
            'temperature': (15, 35),
            'precipitation': (0, 150),
            'humidity': (30, 80),
            'wind_speed': (2, 12)
        }
        
        min_val, max_val = value_ranges.get(variable, (10, 30))
        
        data = []
        for province in provinces:
            value = round(random.uniform(min_val, max_val), 2)
            data.append({
                'name': province,
                'value': value
            })
        
        return data
    
    def generate_mock_timeseries(self, variable, start_date, end_date):
        start = datetime.strptime(start_date, '%Y-%m-%d')
        end = datetime.strptime(end_date, '%Y-%m-%d')
        
        base_values = {
            'temperature': 25,
            'precipitation': 50,
            'humidity': 60,
            'wind_speed': 7
        }
        
        seasonal_amplitude = {
            'temperature': 8,
            'precipitation': 40,
            'humidity': 15,
            'wind_speed': 3
        }
        
        base = base_values.get(variable, 20)
        amplitude = seasonal_amplitude.get(variable, 5)
        
        data = []
        current = start
        
        while current <= end:
            month_factor = (current.month - 1) / 12 * 2 * 3.14159
            seasonal_value = base + amplitude * (1 + random.uniform(-0.3, 0.3)) * \
                           (1 if variable == 'temperature' else -1) * \
                           (1 if current.month in [5, 6, 7, 8] else 0.5)
            
            if variable == 'precipitation':
                if current.month in [7, 8, 9]:
                    seasonal_value = base + amplitude * random.uniform(1.5, 2.5)
                else:
                    seasonal_value = base * random.uniform(0.3, 0.8)
            
            value = round(max(0, seasonal_value + random.uniform(-5, 5)), 2)
            
            data.append({
                'date': current.strftime('%Y-%m-%d'),
                'value': value
            })
            
            if current.month == 12:
                current = current.replace(year=current.year + 1, month=1)
            else:
                current = current.replace(month=current.month + 1)
        
        return data
