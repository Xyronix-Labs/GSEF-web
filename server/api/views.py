from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson.objectid import ObjectId
from .mongodb import db

class ItemAPI(APIView):
    collection = db["items"]  # Replace 'items' with your collection name

    # GET: Retrieve all items
    def get(self, request):
        items = list(self.collection.find({}, {"_id": 1, "name": 1, "description": 1}))
        for item in items:
            item["_id"] = str(item["_id"])  # Convert ObjectId to string
        return Response(items, status=status.HTTP_200_OK)

    # POST: Create a new item
    def post(self, request):
        data = request.data
        result = self.collection.insert_one(data)
        return Response({"_id": str(result.inserted_id)}, status=status.HTTP_201_CREATED)

    # PUT: Update an item by ID
    def put(self, request, pk):
        data = request.data
        result = self.collection.update_one({"_id": ObjectId(pk)}, {"$set": data})
        if result.matched_count == 0:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"message": "Item updated successfully"}, status=status.HTTP_200_OK)

    # DELETE: Delete an item by ID
    def delete(self, request, pk):
        result = self.collection.delete_one({"_id": ObjectId(pk)})
        if result.deleted_count == 0:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"message": "Item deleted successfully"}, status=status.HTTP_200_OK)
    
class ScholarshipFormAPI(APIView):
    collection = db["form"]  # Use the 'form' collection in your MongoDB database

    # POST: Create a new scholarship form entry
    def post(self, request):
        data = request.data  # Get the form data from the request
        if not data:
            return Response({"error": "No data provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Insert the data into the MongoDB collection
        result = self.collection.insert_one(data)
        return Response({"_id": str(result.inserted_id)}, status=status.HTTP_201_CREATED)