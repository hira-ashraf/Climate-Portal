import geemap
import ee
from config import Config

class GeeMapHelper:
    def __init__(self, data_fetcher):
        self.data_fetcher = data_fetcher
        self.initialized = data_fetcher.initialized
    
    def create_climate_map(self, variable='temperature', year=2024, month=10):
        m = geemap.Map(
            center=[Config.PAKISTAN_CENTER['lat'], Config.PAKISTAN_CENTER['lon']], 
            zoom=Config.PAKISTAN_CENTER['zoom']
        )
        
        m.add_basemap('HYBRID')
        
        pakistan_bounds = ee.Geometry.Rectangle([
            Config.PAKISTAN_BOUNDS['west'],
            Config.PAKISTAN_BOUNDS['south'],
            Config.PAKISTAN_BOUNDS['east'],
            Config.PAKISTAN_BOUNDS['north']
        ])
        
        m.centerObject(pakistan_bounds, Config.PAKISTAN_CENTER['zoom'])
        
        if self.initialized:
            try:
                image = self.data_fetcher.fetch_era5_for_map(variable, year, month)
                
                if image is not None:
                    var_config = Config.CLIMATE_VARIABLES.get(variable, {})
                    gee_band = var_config.get('gee_band', 'temperature_2m')
                    scale_factor = var_config.get('scale_factor', 1)
                    offset = var_config.get('offset', 0)
                    
                    image_scaled = image.select(gee_band).multiply(scale_factor).add(offset)
                    
                    vis_params = self._get_vis_params(variable)
                    
                    m.addLayer(
                        image_scaled.clip(pakistan_bounds),
                        vis_params,
                        f'{var_config.get("name", variable)} ({year}-{month:02d})'
                    )
                    
                    m.add_colorbar(
                        vis_params=vis_params,
                        label=f'{var_config.get("name", variable)} ({var_config.get("unit", "")})',
                        layer_name=f'{var_config.get("name", variable)} ({year}-{month:02d})'
                    )
            except Exception as e:
                print(f"Error adding Earth Engine layer: {e}")
                self._add_mock_data_notice(m)
        else:
            self._add_mock_data_notice(m)
        
        with open('static/data/pakistan_boundaries.geojson', 'r') as f:
            import json
            geojson_data = json.load(f)
            m.add_geojson(geojson_data, layer_name='Pakistan Boundaries')
        
        m.add_layer_control()
        
        return m
    
    def _get_vis_params(self, variable):
        if variable == 'temperature':
            return {
                'min': -10,
                'max': 45,
                'palette': ['blue', 'cyan', 'yellow', 'orange', 'red']
            }
        elif variable == 'precipitation':
            return {
                'min': 0,
                'max': 200,
                'palette': ['white', 'lightblue', 'blue', 'darkblue', 'purple']
            }
        elif variable == 'humidity':
            return {
                'min': 0,
                'max': 100,
                'palette': ['brown', 'yellow', 'lightgreen', 'green', 'darkgreen']
            }
        elif variable == 'wind_speed':
            return {
                'min': 0,
                'max': 20,
                'palette': ['white', 'lightgray', 'gray', 'darkgray', 'black']
            }
        else:
            return {
                'min': 0,
                'max': 100,
                'palette': ['blue', 'green', 'yellow', 'orange', 'red']
            }
    
    def _add_mock_data_notice(self, m):
        html = """
        <div style="position: fixed; 
                    top: 10px; 
                    left: 60px; 
                    width: 300px; 
                    background-color: #fff3cd; 
                    border: 2px solid #ffc107; 
                    border-radius: 5px; 
                    padding: 10px; 
                    z-index: 1000;
                    font-family: Arial, sans-serif;">
            <strong>⚠ Earth Engine Not Connected</strong><br>
            <small>Configure GEE_PROJECT_ID to view real climate data</small>
        </div>
        """
        m.add_html(html)
    
    def to_html(self, m):
        return m.to_html()
