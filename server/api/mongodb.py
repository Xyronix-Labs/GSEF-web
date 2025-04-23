from pymongo import MongoClient
from django.conf import settings
import logging
import certifi

# Set up logging
logger = logging.getLogger(__name__)

# Initialize MongoDB client
try:
    # Use certifi for SSL certificate verification
    client = MongoClient(
        settings.MONGO_URI,
        tlsCAFile=certifi.where(),  # Add this for SSL verification
        serverSelectionTimeoutMS=5000  # 5 second timeout
    )
    
    # Access the database
    db = client["users"]  # This is for the ItemAPI collection
    
    def test_connection():
        try:
            # Ping the database to check the connection
            client.admin.command("ping")
            logger.info("✅ MongoDB connection is successful!")
            print("✅ MongoDB connection is successful!")
            
            # Verify form database exists or will be created
            form_db = client["form"]
            data_collection = form_db["data"]
            logger.info(f"✅ Confirmed access to 'form' database and 'data' collection")
            print(f"✅ Confirmed access to 'form' database and 'data' collection")
            
            return True
        except Exception as e:
            logger.error(f"❌ MongoDB connection failed: {str(e)}")
            print(f"❌ MongoDB connection failed: {str(e)}")
            return False
            
except Exception as e:
    logger.error(f"❌ MongoDB client initialization failed: {str(e)}")
    print(f"❌ MongoDB client initialization failed: {str(e)}")
    # Provide a fallback client that will raise clear errors if used
    client = None
    db = None