import geemap
import folium
import ee
from config import Config
import json

class GeeMapHelper:
    def __init__(self, data_fetcher):
        self.data_fetcher = data_fetcher
        self.initialized = data_fetcher.initialized
    
    def create_climate_map(self, variable='temperature', year=2024, month=10):
        if self.initialized:
            try:
                return self._create_ee_map(variable, year, month)
            except Exception as e:
                print(f"Error creating EE map: {e}")
                return self._create_folium_map(variable, year, month)
        else:
            return self._create_folium_map(variable, year, month)
    
    def _create_ee_map(self, variable, year, month):
        m = geemap.Map(
            center=[Config.PAKISTAN_CENTER['lat'], Config.PAKISTAN_CENTER['lon']], 
            zoom=Config.PAKISTAN_CENTER['zoom'],
            ee_initialize=False,
            height='600px'
        )
        
        m.add_basemap('Esri.WorldImagery')
        
        pakistan_bounds = ee.Geometry.Rectangle([
            Config.PAKISTAN_BOUNDS['west'],
            Config.PAKISTAN_BOUNDS['south'],
            Config.PAKISTAN_BOUNDS['east'],
            Config.PAKISTAN_BOUNDS['north']
        ])
        
        image = self.data_fetcher.fetch_era5_for_map(variable, year, month)
        
        if image is not None:
            var_config = Config.CLIMATE_VARIABLES.get(variable, {})
            gee_band = var_config.get('gee_band', 'temperature_2m')
            scale_factor = var_config.get('scale_factor', 1)
            offset = var_config.get('offset', 0)
            
            image_scaled = image.select(gee_band).multiply(scale_factor).add(offset)
            
            vis_params = self._get_vis_params(variable)
            
            layer_name = f'{var_config.get("name", variable)} ({year}-{month:02d})'
            
            m.addLayer(
                image_scaled.clip(pakistan_bounds),
                vis_params,
                layer_name
            )
            
            m.add_colorbar(
                vis_params=vis_params,
                label=f'{var_config.get("name", variable)} ({var_config.get("unit", "")})',
                layer_name=layer_name
            )
        
        with open('static/data/pakistan_boundaries.geojson', 'r') as f:
            geojson_data = json.load(f)
            m.add_geojson(geojson_data, layer_name='Pakistan Boundaries')
        
        m.add_layer_control()
        
        return m
    
    def _create_folium_map(self, variable, year, month):
        m = folium.Map(
            location=[Config.PAKISTAN_CENTER['lat'], Config.PAKISTAN_CENTER['lon']],
            zoom_start=Config.PAKISTAN_CENTER['zoom'],
            tiles='OpenStreetMap',
            height='600px',
            width='100%'
        )
        
        folium.TileLayer('Esri.WorldImagery', name='Satellite').add_to(m)
        folium.TileLayer('OpenStreetMap', name='Street Map').add_to(m)
        
        with open('static/data/pakistan_boundaries.geojson', 'r') as f:
            geojson_data = json.load(f)
            
            var_config = Config.CLIMATE_VARIABLES.get(variable, {})
            mock_data = self.data_fetcher.generate_mock_zonal_stats(variable)
            
            def style_function(feature):
                province_name = feature['properties'].get('name', '')
                
                for item in mock_data:
                    if item['name'].lower() in province_name.lower() or province_name.lower() in item['name'].lower():
                        value = item['value']
                        color = self._value_to_color(value, variable)
                        return {
                            'fillColor': color,
                            'color': 'black',
                            'weight': 2,
                            'fillOpacity': 0.6
                        }
                
                return {
                    'fillColor': 'gray',
                    'color': 'black',
                    'weight': 2,
                    'fillOpacity': 0.3
                }
            
            def highlight_function(feature):
                return {
                    'fillColor': 'yellow',
                    'color': 'black',
                    'weight': 3,
                    'fillOpacity': 0.8
                }
            
            tooltip = folium.GeoJsonTooltip(
                fields=['name'],
                aliases=['Province:'],
                style='background-color: white; color: #333; font-family: arial; font-size: 12px; padding: 10px;'
            )
            
            folium.GeoJson(
                geojson_data,
                style_function=style_function,
                highlight_function=highlight_function,
                tooltip=tooltip,
                name='Climate Data'
            ).add_to(m)
        
        title_html = f'''
        <div style="position: fixed; 
                    top: 10px; left: 60px; width: 400px; height: 90px; 
                    background-color: white; border: 2px solid #3388ff;
                    border-radius: 5px; z-index: 1000; padding: 10px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
            <h4 style="margin: 0; color: #3388ff;">Climate Map - {var_config.get("name", variable)}</h4>
            <p style="margin: 5px 0;"><strong>Date:</strong> {year}-{month:02d}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #666;">
                {"Earth Engine data visualization" if self.initialized else "⚠ Mock data - Configure GEE_PROJECT_ID for real data"}
            </p>
        </div>
        '''
        m.get_root().html.add_child(folium.Element(title_html))
        
        legend_html = self._create_legend(variable)
        m.get_root().html.add_child(folium.Element(legend_html))
        
        folium.LayerControl().add_to(m)
        
        return m
    
    def _value_to_color(self, value, variable):
        if variable == 'temperature':
            if value < 10:
                return '#0000ff'
            elif value < 20:
                return '#00ffff'
            elif value < 30:
                return '#ffff00'
            elif value < 40:
                return '#ff8800'
            else:
                return '#ff0000'
        elif variable == 'precipitation':
            if value < 20:
                return '#ffffff'
            elif value < 50:
                return '#add8e6'
            elif value < 100:
                return '#0000ff'
            elif value < 150:
                return '#00008b'
            else:
                return '#800080'
        elif variable == 'humidity':
            if value < 30:
                return '#a0522d'
            elif value < 50:
                return '#ffff00'
            elif value < 70:
                return '#90ee90'
            elif value < 85:
                return '#00ff00'
            else:
                return '#006400'
        else:
            if value < 5:
                return '#ffffff'
            elif value < 10:
                return '#d3d3d3'
            elif value < 15:
                return '#808080'
            else:
                return '#000000'
    
    def _create_legend(self, variable):
        var_config = Config.CLIMATE_VARIABLES.get(variable, {})
        
        if variable == 'temperature':
            colors = ['#0000ff', '#00ffff', '#ffff00', '#ff8800', '#ff0000']
            labels = ['< 10°C', '10-20°C', '20-30°C', '30-40°C', '> 40°C']
        elif variable == 'precipitation':
            colors = ['#ffffff', '#add8e6', '#0000ff', '#00008b', '#800080']
            labels = ['< 20mm', '20-50mm', '50-100mm', '100-150mm', '> 150mm']
        elif variable == 'humidity':
            colors = ['#a0522d', '#ffff00', '#90ee90', '#00ff00', '#006400']
            labels = ['< 30%', '30-50%', '50-70%', '70-85%', '> 85%']
        else:
            colors = ['#ffffff', '#d3d3d3', '#808080', '#000000']
            labels = ['Low', 'Medium', 'High', 'Very High']
        
        legend_items = ''.join([
            f'<div style="margin: 3px 0;"><span style="display: inline-block; width: 20px; height: 20px; background-color: {color}; border: 1px solid #333; margin-right: 5px;"></span>{label}</div>'
            for color, label in zip(colors, labels)
        ])
        
        return f'''
        <div style="position: fixed; 
                    bottom: 30px; right: 10px; width: 180px;
                    background-color: white; border: 2px solid #3388ff;
                    border-radius: 5px; z-index: 1000; padding: 10px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
            <h4 style="margin: 0 0 10px 0; color: #3388ff; font-size: 14px;">Legend</h4>
            {legend_items}
        </div>
        '''
    
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
    
    def to_html(self, m):
        if hasattr(m, 'to_html'):
            return m.to_html()
        else:
            return m._repr_html_()
