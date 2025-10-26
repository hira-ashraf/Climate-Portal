"""
Database models and connection management for PostgreSQL with PostGIS
"""
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from datetime import datetime
from config import Config

Base = declarative_base()

# Database Engine
engine = create_engine(
    Config.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Models
class AdministrativeUnit(Base):
    """Administrative boundaries with PostGIS geometry"""
    __tablename__ = 'administrative_units'
    
    id = Column(String(50), primary_key=True)
    name = Column(String(200), nullable=False, index=True)
    level = Column(Integer, nullable=False, index=True)
    parent_id = Column(String(50), nullable=True)
    
    # PostGIS geometry column
    geometry = Column(Geometry('MULTIPOLYGON', srid=4326), nullable=False)
    
    # Additional properties stored as JSONB
    properties = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Spatial index
    __table_args__ = (
        Index('idx_admin_geometry', 'geometry', postgresql_using='gist'),
        Index('idx_admin_level_name', 'level', 'name'),
    )


class ClimateData(Base):
    """Climate observations and derived data"""
    __tablename__ = 'climate_data'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    location_id = Column(String(50), nullable=False, index=True)
    variable = Column(String(50), nullable=False, index=True)
    
    # Time information
    date = Column(DateTime, nullable=False, index=True)
    aggregation = Column(String(20), default='monthly')  # hourly, daily, monthly, etc.
    
    # Climate value
    value = Column(Float, nullable=True)
    
    # Quality flags
    quality_flag = Column(String(20), default='good')
    data_source = Column(String(50), default='ERA5')
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_climate_lookup', 'location_id', 'variable', 'date', 'aggregation'),
        Index('idx_climate_date', 'date', 'variable'),
    )


class ClimateIndex(Base):
    """Derived climate indices (heat stress, drought, etc.)"""
    __tablename__ = 'climate_indices'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    location_id = Column(String(50), nullable=False, index=True)
    index_name = Column(String(50), nullable=False, index=True)  # spi, spei, heat_index, etc.
    
    date = Column(DateTime, nullable=False, index=True)
    value = Column(Float, nullable=True)
    
    # Category and severity
    category = Column(String(50), nullable=True)  # heat_stress, drought, extreme
    severity = Column(String(20), nullable=True)   # normal, moderate, severe, extreme
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_index_lookup', 'location_id', 'index_name', 'date'),
    )


class ExtremeEvent(Base):
    """Extreme weather events and statistics"""
    __tablename__ = 'extreme_events'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    location_id = Column(String(50), nullable=False, index=True)
    event_type = Column(String(50), nullable=False, index=True)  # heatwave, drought, flood
    
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    
    # Event characteristics
    peak_value = Column(Float, nullable=True)
    duration_days = Column(Integer, nullable=True)
    severity = Column(String(20), nullable=True)
    
    # Return period analysis
    return_period_years = Column(Float, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_event_lookup', 'location_id', 'event_type', 'start_date'),
    )


class MLPrediction(Base):
    """Machine learning predictions and forecasts"""
    __tablename__ = 'ml_predictions'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    location_id = Column(String(50), nullable=False, index=True)
    variable = Column(String(50), nullable=False, index=True)
    
    prediction_date = Column(DateTime, nullable=False, index=True)
    predicted_value = Column(Float, nullable=True)
    
    # Uncertainty bounds
    lower_bound = Column(Float, nullable=True)
    upper_bound = Column(Float, nullable=True)
    
    # Model metadata
    model_type = Column(String(50), nullable=True)
    confidence_score = Column(Float, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_prediction_lookup', 'location_id', 'variable', 'prediction_date'),
    )


# Database utility functions
def get_db():
    """Dependency for FastAPI endpoints"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_database():
    """Initialize database and create all tables"""
    try:
        # Import models to ensure they're registered
        from sqlalchemy import inspect
        
        # Create PostGIS extension
        with engine.connect() as conn:
            conn.execute("CREATE EXTENSION IF NOT EXISTS postgis;")
            conn.commit()
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        
        print("✅ PostgreSQL database initialized with PostGIS")
        return True
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        print("   Using fallback SQLite database")
        return False


def check_database_connection():
    """Check if database is accessible"""
    try:
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False

