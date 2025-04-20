from pymongo import MongoClient
from django.conf import settings

# Initialize MongoDB client
client = MongoClient(settings.MONGO_URI)

# Access the database (replace 'your_database_name' with your actual database name)
db = client["users"]

def test_connection():
    try:
        # Ping the database to check the connection
        client.admin.command("ping")
        print("✅ MongoDB connection is successful!")
    except Exception as e:
        print("❌ MongoDB connection failed:", e)