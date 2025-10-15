from flask import Flask, render_template, jsonify, request, send_file
from flask_cors import CORS
from config import Config
from modules import ClimateDataFetcher, SpatialProcessor, ClimateForecaster
from modules.utils import create_database, insert_sample_boundaries, rate_limit
import json
from datetime import datetime
import io
import csv

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

create_database()
insert_sample_boundaries()

data_fetcher = ClimateDataFetcher()
spatial_processor = SpatialProcessor()
forecaster = ClimateForecaster()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/map')
def map_viewer():
    return render_template('map_viewer.html')

@app.route('/timeseries')
def timeseries():
    return render_template('time_series.html')

@app.route('/forecast')
def forecast():
    return render_template('forecast.html')

@app.route('/download')
def download():
    return render_template('download.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/api/map-data')
def get_map_data():
    variable = request.args.get('variable', 'temperature')
    date_str = request.args.get('date', datetime.now().strftime('%Y-%m'))
    level = int(request.args.get('level', 1))
    
    try:
        year, month = map(int, date_str.split('-'))
    except:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM'}), 400
    
    boundaries = spatial_processor.get_boundaries(level)
    
    if data_fetcher.initialized:
        try:
            image = data_fetcher.fetch_era5_for_map(variable, year, month)
            
            import ee
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
    
    return jsonify(result)

@app.route('/api/boundaries')
def get_boundaries():
    level = int(request.args.get('level', 1))
    boundaries = spatial_processor.get_boundaries(level)
    return jsonify(boundaries)

@app.route('/api/timeseries')
def get_timeseries():
    location_id = request.args.get('location_id', 'punjab')
    variable = request.args.get('variable', 'temperature')
    start_date = request.args.get('start', '2020-01-01')
    end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
    aggregation = request.args.get('aggregation', 'monthly')
    
    if data_fetcher.initialized:
        try:
            import ee
            pakistan_center = ee.Geometry.Point([69.3451, 30.3753])
            
            data = data_fetcher.extract_timeseries(variable, start_date, end_date, pakistan_center, aggregation)
        except Exception as e:
            print(f"Error fetching real timeseries: {e}")
            data = data_fetcher.generate_mock_timeseries(variable, start_date, end_date)
    else:
        data = data_fetcher.generate_mock_timeseries(variable, start_date, end_date)
    
    return jsonify({
        'location': location_id,
        'variable': variable,
        'data': data,
        'aggregation': aggregation
    })

@app.route('/api/compare', methods=['POST'])
def compare_regions():
    data = request.json
    locations = data.get('locations', [])
    variable = data.get('variable', 'temperature')
    time_period = data.get('time_period', '2023-01-01 to 2023-12-31')
    
    try:
        start_date, end_date = time_period.split(' to ')
    except:
        return jsonify({'error': 'Invalid time period format'}), 400
    
    comparison_data = []
    
    for location in locations:
        timeseries = data_fetcher.generate_mock_timeseries(variable, start_date, end_date)
        values = [d['value'] for d in timeseries]
        
        comparison_data.append({
            'location': location,
            'mean': round(sum(values) / len(values), 2) if values else 0,
            'min': round(min(values), 2) if values else 0,
            'max': round(max(values), 2) if values else 0,
            'timeseries': timeseries
        })
    
    return jsonify({
        'variable': variable,
        'time_period': time_period,
        'comparison': comparison_data
    })

@app.route('/api/forecast')
def get_forecast():
    location_id = request.args.get('location_id', 'punjab')
    variable = request.args.get('variable', 'temperature')
    horizon = request.args.get('horizon', 'monthly')
    
    historical_data = data_fetcher.generate_mock_timeseries(
        variable, '2023-01-01', datetime.now().strftime('%Y-%m-%d')
    )
    
    forecast_data = forecaster.predict_future(variable, historical_data, months_ahead=3)
    model_info = forecaster.get_model_info(variable)
    
    return jsonify({
        'location': location_id,
        'variable': variable,
        'forecast': forecast_data,
        'model_info': model_info
    })

@app.route('/api/statistics/summary')
def get_statistics():
    period = request.args.get('period', 'current_month')
    
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
    
    return jsonify(summary)

@app.route('/api/download', methods=['POST'])
@rate_limit(max_requests=5, window=3600)
def download_data():
    data = request.json
    location = data.get('location', {})
    variables = data.get('variables', [])
    start_date = data.get('start_date', '2020-01-01')
    end_date = data.get('end_date', '2023-12-31')
    format_type = data.get('format', 'csv')
    
    climate_data = []
    for variable in variables:
        timeseries = data_fetcher.generate_mock_timeseries(variable, start_date, end_date)
        for entry in timeseries:
            climate_data.append({
                'date': entry['date'],
                'variable': variable,
                'value': entry['value'],
                'location': location.get('id', 'unknown'),
                'units': Config.CLIMATE_VARIABLES.get(variable, {}).get('unit', '')
            })
    
    if format_type == 'csv':
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=['date', 'variable', 'value', 'location', 'units'])
        writer.writeheader()
        writer.writerows(climate_data)
        
        output.seek(0)
        return send_file(
            io.BytesIO(output.getvalue().encode()),
            mimetype='text/csv',
            as_attachment=True,
            download_name=f'climate_data_{start_date}_{end_date}.csv'
        )
    elif format_type == 'json':
        return jsonify(climate_data)
    else:
        return jsonify({'error': 'Unsupported format'}), 400

@app.route('/api/config')
def get_config():
    return jsonify({
        'center': Config.PAKISTAN_CENTER,
        'bounds': Config.PAKISTAN_BOUNDS,
        'variables': Config.CLIMATE_VARIABLES
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
