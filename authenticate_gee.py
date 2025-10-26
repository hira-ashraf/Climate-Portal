"""
Google Earth Engine Authentication Script
Run this once to authenticate your GEE account
"""
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

import ee

print("=" * 60)
print("Google Earth Engine Authentication")
print("=" * 60)
print()
print("This will open a browser window for you to sign in")
print("with your Google account.")
print()
print("Make sure you have registered for Google Earth Engine at:")
print("https://earthengine.google.com/signup/")
print()
print("-" * 60)

try:
    # Trigger authentication
    print("Starting authentication process...")
    ee.Authenticate()
    print()
    print("[OK] Authentication successful!")
    print()
    
    # Test initialization
    print("Testing Earth Engine connection...")
    ee.Initialize()
    print("[OK] Earth Engine initialized successfully!")
    print()
    print("-" * 60)
    print("SUCCESS! You can now run the app with:")
    print("  python app.py")
    print("-" * 60)
    
except Exception as e:
    print()
    print("[ERROR] Authentication failed:")
    print(f"  {e}")
    print()
    print("Make sure you:")
    print("  1. Have a Google account")
    print("  2. Have registered for Earth Engine")
    print("  3. Are connected to the internet")
    print()
    print("Visit: https://earthengine.google.com/signup/")
    print("-" * 60)

