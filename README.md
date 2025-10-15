# Climate Information Portal of Pakistan

A fully functional web-based Climate Information Portal for Pakistan using Flask backend and modern web technologies. This academic research project democratizes climate data access through ERA5 reanalysis integration with Google Earth Engine visualization.

## Features

### 🗺️ Interactive Map Viewer
- Visualize climate data on an interactive map of Pakistan
- View temperature, precipitation, humidity, and wind speed data
- Click on provinces to see detailed climate information
- Color-coded choropleth maps based on climate values

### 📊 Time Series Analysis
- Analyze climate trends over time for any location
- Interactive Plotly charts with zoom, pan, and hover features
- Download data as CSV for offline analysis
- Compare multiple time periods

### 🔮 Climate Forecasts
- View 3-month ahead climate predictions using ML models
- Confidence intervals showing prediction uncertainty
- Random Forest-based forecasting with climatological fallback

### 📥 Data Download
- Download climate datasets in CSV or JSON format
- Select custom date ranges and variables
- Rate-limited to prevent abuse (5 downloads/hour)

### 📚 Educational Resources
- Comprehensive glossary of climate terms
- FAQ section for common questions
- Data source documentation and citations

## Technology Stack

- **Backend:** Flask (Python 3.11+)
- **Frontend:** HTML5, CSS3, JavaScript
- **Mapping:** Leaflet.js
- **Visualization:** Plotly.js
- **Database:** SQLite
- **Data Source:** Google Earth Engine (ERA5 Reanalysis)
- **ML:** Scikit-learn (Random Forest)

## Quick Start

### Running the Application

The application is already configured and running! Simply:

1. Click the webview to see the application
2. Navigate through different features using the navigation menu

### Using Mock Data (Default)

The application works out-of-the-box with mock data, so you can explore all features immediately without any configuration.

### Enabling Real Google Earth Engine Data (Optional)

To use real ERA5 climate data instead of mock data, you need to configure Google Earth Engine credentials:

1. **Get a Google Earth Engine Account:**
   - Visit https://earthengine.google.com/
   - Sign up for access (free for research and education)
   - Create a Cloud Project and note your Project ID

2. **Configure Your Credentials:**
   - You'll need to provide your `GEE_PROJECT_ID` as a secret
   - The system will automatically use real ERA5 data when credentials are available
   - Without credentials, the app gracefully falls back to mock data

3. **To add your GEE credentials:**
   - Use the Replit Secrets tab to add `GEE_PROJECT_ID` with your project ID
   - Restart the application to apply changes

## Project Structure

```
climate-portal/
├── app.py                          # Main Flask application
├── config.py                       # Configuration settings
├── modules/
│   ├── data_fetcher.py            # Google Earth Engine data retrieval
│   ├── spatial_processor.py       # Spatial aggregation functions
│   ├── ml_models.py               # Machine learning forecast models
│   └── utils.py                   # Helper functions
├── static/
│   ├── css/style.css              # Custom styles
│   ├── js/
│   │   ├── map.js                 # Leaflet map logic
│   │   ├── charts.js              # Time series charts
│   │   └── main.js                # Forecast visualization
│   └── data/
│       └── pakistan_boundaries.geojson
├── templates/
│   ├── index.html                 # Landing page
│   ├── map_viewer.html            # Interactive map
│   ├── time_series.html           # Time series charts
│   ├── forecast.html              # ML forecasts
│   ├── download.html              # Data download
│   └── about.html                 # Documentation
└── data/
    └── climate_data.db            # SQLite database
```

## Climate Variables

The portal provides access to the following climate variables:

- **Temperature:** 2-meter air temperature (°C)
- **Precipitation:** Total precipitation (mm)
- **Humidity:** Relative humidity derived from dewpoint (%)
- **Wind Speed:** 10-meter wind speed (m/s)

## Data Sources

### ERA5 Reanalysis
ERA5 is the fifth generation ECMWF atmospheric reanalysis of the global climate. It provides hourly estimates of atmospheric, land and oceanic climate variables from 1979 to present.

### Spatial Coverage
- Pakistan's complete geographic extent
- Bounding box: 60.87°E to 77.84°E, 23.63°N to 37.13°N

### Temporal Coverage
- Historical data: 1979 to present
- Monthly and daily aggregations available

## API Endpoints

### Get Map Data
```
GET /api/map-data?variable=temperature&date=2024-01&level=1
```

### Get Time Series
```
GET /api/timeseries?location_id=punjab&variable=temperature&start=2020-01-01&end=2024-12-31
```

### Get Forecast
```
GET /api/forecast?location_id=punjab&variable=temperature&horizon=monthly
```

### Download Data
```
POST /api/download
Body: {
  "location": {"id": "punjab"},
  "variables": ["temperature", "precipitation"],
  "start_date": "2020-01-01",
  "end_date": "2023-12-31",
  "format": "csv"
}
```

## Citation

If you use data from this portal in your research, please cite:

```
Hersbach, H., Bell, B., Berrisford, P., et al. (2020). 
The ERA5 global reanalysis. Quarterly Journal of the 
Royal Meteorological Society, 146(730), 1999-2049. 
doi:10.1002/qj.3803
```

## Development

### Database Schema

The application uses SQLite with the following tables:
- `administrative_units`: Pakistan's provinces and districts
- `climate_cache`: Cached climate data for performance
- `ml_predictions`: Stored forecast predictions
- `download_requests`: Rate limiting tracking

### Machine Learning Models

The forecasting system uses Random Forest regression with:
- Lagged climate variables (1, 3, 6 months)
- Seasonal indicators (month of year)
- Long-term trend components

Models are trained on historical data and provide 3-month ahead predictions with confidence intervals.

## Security Features

- Rate limiting on download endpoints (5 requests/hour)
- Input validation on all API endpoints
- Secure secret management for API keys
- CORS enabled for frontend integration

## Contributing

This is an academic research project. For questions or suggestions, please refer to the About page in the application.

## License

Academic Research Project - Climate Information Portal of Pakistan

---

**Note:** This application is designed for research and educational purposes. Real-time climate data requires valid Google Earth Engine credentials. Without them, the application uses mock data that demonstrates all functionality.
