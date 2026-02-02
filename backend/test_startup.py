import sys
import os

# Add current directory to path so 'app' module can be found
sys.path.append(os.getcwd())

print("Attempting to import app.main...")
try:
    from app.main import app
    print("SUCCESS: Successfully imported app.main")
except Exception as e:
    print(f"FAILURE: Startup import failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
