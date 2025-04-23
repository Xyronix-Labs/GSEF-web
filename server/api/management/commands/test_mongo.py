from django.core.management.base import BaseCommand
from api.mongodb import test_connection, client

class Command(BaseCommand):
    help = 'Tests MongoDB connection and database access'

    def handle(self, *args, **kwargs):
        self.stdout.write('Testing MongoDB connection...')
        
        if test_connection():
            self.stdout.write(self.style.SUCCESS('MongoDB connection successful!'))
            
            # Check access to the form database and data collection
            try:
                form_db = client["form"]
                data_collection = form_db["data"]
                
                # Try inserting a test document
                test_id = data_collection.insert_one({
                    "test": True,
                    "message": "MongoDB connection test"
                }).inserted_id
                
                self.stdout.write(self.style.SUCCESS(
                    f"Successfully inserted test document into 'form.data' with ID: {test_id}")
                )
                
                # Delete the test document
                data_collection.delete_one({"_id": test_id})
                self.stdout.write(self.style.SUCCESS("Test document deleted successfully"))
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(
                    f"Error accessing 'form.data' collection: {str(e)}")
                )
        else:
            self.stdout.write(self.style.ERROR('MongoDB connection failed!'))