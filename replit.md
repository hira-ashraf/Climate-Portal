# Climate Information Portal of Pakistan

## Overview

An academic research web application that democratizes climate data access for Pakistan through ERA5 reanalysis integration with Google Earth Engine. The portal provides interactive visualization, time series analysis, and machine learning-based forecasting of climate variables (temperature, precipitation, humidity, wind speed) across Pakistan's administrative regions.

**Status:** ✅ Fully implemented and operational (October 16, 2025)
**Latest Update:** Migrated map visualization from Leaflet to geemap/folium for professional GIS interface

## User Preferences

- Preferred communication style: Simple, everyday language
- **Interface Design**: Green forest/emerald color palette (replaced original purple/blue)
- **Dark Mode**: Required and implemented with localStorage persistence
- **Language Support**: Bilingual English/Urdu with RTL support

## Recent Changes (October 16, 2025)

- ✅ **LATEST: Replaced Leaflet with geemap/folium for professional GIS portal interface**
- ✅ **LATEST: Added GeeMapHelper module for Earth Engine and folium map generation**
- ✅ **LATEST: Implemented dual-path visualization (EE with colorbar when configured, folium fallback)**
- ✅ **LATEST: Color-coded choropleth maps with interactive tooltips and legends**
- ✅ Complete application built from scratch based on detailed requirements
- ✅ All critical features implemented: interactive maps, time series, forecasts, data download
- ✅ Database initialization happens automatically on startup
- ✅ Real Google Earth Engine data integration with graceful fallback to mock data
- ✅ Comprehensive documentation added (README.md)
- ✅ All API endpoints tested and working
- ✅ Frontend fully responsive with Bootstrap 5
- ✅ Interface redesigned with green forest/emerald color palette
- ✅ Dark mode implemented with moon/sun toggle in navbar
- ✅ Bilingual support added (English/Urdu) with language switcher
- ✅ RTL support for Urdu with Noto Nastaliq Urdu font
- ✅ Multiple temporal aggregations added (Hourly, Daily, Monthly, Seasonal, Annual)
- ✅ Service account authentication support for Google Earth Engine
- ✅ Database caching system for climate data (reduces API calls)
- ✅ Enhanced download with aggregation options

## System Architecture

### Backend Architecture

**Framework**: Flask-based Python web application with modular design
- **Main Application** (`app.py`): Route handlers for page rendering and API endpoints
- **Configuration** (`config.py`): Centralized configuration using environment variables and constants for Pakistan geographical bounds, GEE credentials, and climate variable mappings
- **Modular Services**:
  - `ClimateDataFetcher`: Google Earth Engine integration for ERA5 climate data retrieval
  - `SpatialProcessor`: Geographic boundary management and spatial aggregation
  - `ClimateForecaster`: Random Forest-based ML forecasting with 3-month horizon
  - `GeeMapHelper`: Professional GIS map generation using geemap and folium
  - `utils`: Database helpers, rate limiting, and shared utilities

**Design Rationale**: Modular separation enables independent testing and maintenance of climate data fetching, spatial processing, and forecasting capabilities. Flask chosen for simplicity and academic research context over FastAPI.

### Frontend Architecture

**Technology Stack**: Traditional multi-page application (MPA) with server-side rendering
- **Templates**: Jinja2-based HTML templates for each major feature (map viewer, time series, forecasts, data download)
- **Styling**: Bootstrap 5 for responsive design with custom CSS
- **Visualization Libraries**:
  - **geemap/folium** for professional GIS-style interactive maps with Earth Engine integration
  - Plotly.js for time series charts and forecast visualizations
- **JavaScript**: Vanilla JS organized by feature (map.js, charts.js, main.js)

**Design Rationale**: MPA approach chosen over SPA for simplicity and SEO benefits. Geemap provides professional GIS interface with dual-path rendering: Earth Engine layers with colorbars when credentials are configured, graceful folium fallback with mock data otherwise. Each page is self-contained with specific functionality.

### Data Storage

**Database**: SQLite for development
- **Schema Design**:
  - `administrative_units`: Geographic boundaries with hierarchical structure (provinces/districts)
  - `climate_cache`: Cached climate values to reduce GEE API calls
  - `ml_predictions`: Stored forecasts with metadata
- **Indexing**: Composite indexes on frequently queried fields (location_id, variable, date)

**Design Rationale**: SQLite provides zero-configuration development environment. Schema supports hierarchical administrative boundaries with spatial data stored as GeoJSON text. Caching layer reduces external API dependencies and improves performance. PostGIS migration path available for production.

### Machine Learning Pipeline

**Forecasting Approach**: Random Forest Regressor with climatological fallback
- **Features**: Lag values (1-month, 3-month, 6-month) plus seasonal component (month)
- **Training**: Requires minimum 12 months historical data
- **Output**: Point predictions with confidence intervals
- **Model Persistence**: Pickle serialization per variable

**Design Rationale**: Random Forest chosen for robustness to non-linear patterns and ability to handle limited training data. Simple feature engineering using temporal lags captures seasonal patterns. Fallback to climatological means ensures graceful degradation when insufficient data.

**Trade-offs**: 
- Pros: Fast training, interpretable, works with small datasets
- Cons: Limited extrapolation beyond training distribution, assumes stationarity

### API Design

**RESTful Endpoints**:
- `/api/map-data`: GeoJSON with climate values for choropleth visualization
- `/api/timeseries`: Time series data for location/variable combinations
- `/api/forecast`: ML predictions with uncertainty bounds
- `/api/download`: CSV/JSON export with rate limiting (5 requests/hour)

**Rate Limiting**: Decorator-based implementation prevents download abuse

### Caching Strategy

**In-Memory Caching**: Flask configuration with 1-hour timeout (`CACHE_TIMEOUT = 3600`)
- Climate data cached by location, variable, and date
- Reduces Google Earth Engine API calls
- Database-backed persistence for climate values

**Design Rationale**: Two-tier caching (in-memory + database) balances performance and data persistence. Short timeout ensures reasonably fresh data while minimizing external API dependency.

## External Dependencies

### Primary Data Source

**Google Earth Engine (GEE)**:
- **Dataset**: ERA5 monthly aggregated reanalysis (`ECMWF/ERA5_LAND/MONTHLY_AGGR`)
- **Authentication**: Service account with project ID and private key
- **Variables**: Temperature (2m), total precipitation, humidity, wind speed
- **Processing**: Server-side aggregation over Pakistan administrative boundaries

**Integration Pattern**: Graceful degradation with mock data fallback when GEE unavailable or credentials missing

### Third-Party Libraries

**Python Backend**:
- `flask`: Web framework
- `flask-cors`: Cross-origin resource sharing
- `earthengine-api`: GEE Python SDK
- `scikit-learn`: Random Forest forecasting
- `python-dotenv`: Environment configuration

**Frontend**:
- `bootstrap@5.3.0`: Responsive UI framework
- `leaflet@1.9.4`: Interactive mapping
- `plotly.js`: Chart visualizations
- `font-awesome@6.4.0`: Icon library

### Environment Configuration

**Required Environment Variables**:
- `GEE_PROJECT_ID`: Google Earth Engine project identifier
- `GEE_SERVICE_ACCOUNT`: Service account email
- `GEE_PRIVATE_KEY`: Authentication private key
- `SECRET_KEY`: Flask session security

**Optional**:
- Database path configurable via `DATABASE_PATH`
- Pakistan geographic bounds defined in config (not environment-dependent)

### Geographic Data

**Administrative Boundaries**: 
- Stored as GeoJSON in SQLite
- Sample boundaries for Pakistan provinces inserted on initialization
- Hierarchical structure supports multi-level aggregation (provinces → districts)

**Design Consideration**: Boundaries are application data, not external dependency. Initial sample data covers provincial level; extensible to district/tehsil levels.