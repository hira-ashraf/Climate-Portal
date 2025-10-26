"""
Database setup script for PostgreSQL with PostGIS
Run this script to initialize the database
"""
import sys
from modules.database import init_database, engine, Base, SessionLocal
from modules.utils import insert_sample_boundaries as insert_sqlite_boundaries
from sqlalchemy import text
import json

def setup_postgis_database():
    """Initialize PostgreSQL database with PostGIS extension"""
    print("=" * 60)
    print("Setting up PostgreSQL + PostGIS Database")
    print("=" * 60)
    
    # Initialize database and create tables
    success = init_database()
    
    if not success:
        print("\n❌ Database initialization failed!")
        print("Make sure PostgreSQL is running and accessible.")
        print("Connection string:", engine.url)
        return False
    
    # Insert sample boundaries
    print("\nInserting sample administrative boundaries...")
    
    db = SessionLocal()
    try:
        # Check if boundaries already exist
        result = db.execute(text("SELECT COUNT(*) FROM administrative_units"))
        count = result.scalar()
        
        if count > 0:
            print(f"✅ Database already has {count} administrative units")
            return True
        
        # Sample provinces with proper GeoJSON geometries
        provinces = [
            {
                'id': 'punjab',
                'name': 'Punjab',
                'level': 1,
                'geometry': 'MULTIPOLYGON(((69.5 28.5, 75.5 28.5, 75.5 34.0, 69.5 34.0, 69.5 28.5)))'
            },
            {
                'id': 'sindh',
                'name': 'Sindh',
                'level': 1,
                'geometry': 'MULTIPOLYGON(((66.5 23.7, 71.0 23.7, 71.0 28.5, 66.5 28.5, 66.5 23.7)))'
            },
            {
                'id': 'kpk',
                'name': 'Khyber Pakhtunkhwa',
                'level': 1,
                'geometry': 'MULTIPOLYGON(((69.0 31.5, 74.0 31.5, 74.0 36.0, 69.0 36.0, 69.0 31.5)))'
            },
            {
                'id': 'balochistan',
                'name': 'Balochistan',
                'level': 1,
                'geometry': 'MULTIPOLYGON(((61.0 24.5, 70.0 24.5, 70.0 31.5, 61.0 31.5, 61.0 24.5)))'
            },
            {
                'id': 'gb',
                'name': 'Gilgit-Baltistan',
                'level': 1,
                'geometry': 'MULTIPOLYGON(((72.0 35.0, 77.5 35.0, 77.5 37.0, 72.0 37.0, 72.0 35.0)))'
            },
            {
                'id': 'ajk',
                'name': 'Azad Kashmir',
                'level': 1,
                'geometry': 'MULTIPOLYGON(((73.0 33.5, 74.5 33.5, 74.5 35.0, 73.0 35.0, 73.0 33.5)))'
            }
        ]
        
        for province in provinces:
            query = text("""
                INSERT INTO administrative_units (id, name, level, geometry, properties)
                VALUES (:id, :name, :level, ST_GeomFromText(:geometry, 4326), :properties)
                ON CONFLICT (id) DO NOTHING
            """)
            
            db.execute(query, {
                'id': province['id'],
                'name': province['name'],
                'level': province['level'],
                'geometry': province['geometry'],
                'properties': json.dumps({'type': 'province'})
            })
        
        db.commit()
        print(f"✅ Inserted {len(provinces)} sample boundaries")
        
    except Exception as e:
        print(f"❌ Error inserting boundaries: {e}")
        db.rollback()
        return False
    finally:
        db.close()
    
    print("\n" + "=" * 60)
    print("✅ Database setup completed successfully!")
    print("=" * 60)
    return True


def main():
    """Main setup function"""
    try:
        success = setup_postgis_database()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Setup failed with error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()

