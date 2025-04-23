import os
from django.conf import settings
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import uuid
import datetime

class ScholarshipFormAPI(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:
            # Generate a unique application ID
            year = datetime.datetime.now().year
            random_part = uuid.uuid4().hex[:5]
            application_id = f"IAF-{year}-{random_part}"

            # Create a directory for the applicant
            applicant_dir = os.path.join(settings.MEDIA_ROOT, "Applicants", application_id)
            os.makedirs(applicant_dir, exist_ok=True)

            # Process uploaded files
            uploaded_files = request.FILES
            for field_name, file in uploaded_files.items():
                file_path = os.path.join(applicant_dir, file.name)
                with default_storage.open(file_path, 'wb+') as destination:
                    for chunk in file.chunks():
                        destination.write(chunk)

            # Save other form data (if any)
            form_data = request.data.dict()
            form_data["application_id"] = application_id
            form_data["status"] = "Pending"

            # Save form data to MongoDB or any other database
            # Assuming you have a MongoDB collection named "applications"
            from .mongodb import db
            collection = db["applications"]
            collection.insert_one(form_data)

            return Response({
                "success": True,
                "application_id": application_id,
                "message": "Application submitted successfully!"
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                "success": False,
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def process_form_data(self, data, application_id):
        """Process form data before storing in database"""
        # Convert incoming data to match model fields
        processed_data = {
            "application_id": application_id,
            "status": "Pending",
        }
        
        # Map fields from the frontend to the model
        field_mapping = {
            "firstName": "first_name",
            "lastName": "last_name",
            "email": "email",
            "studentMobile": "student_mobile",
            "dateOfBirth": "date_of_birth",
            "gender": "gender",
            "passportNumber": "passport_number",
            "addressLine1": "address_line1",
            "addressLine2": "address_line2",
            "city": "city",
            "state": "state",
            "postalCode": "postal_code",
            "country": "country",
            "nationality": "nationality",
            "highestEducation": "highest_education",
            "institutionName": "institution_name",
            "graduationYear": "graduation_year",
            "gpa": "gpa",
            "programType": "program_type",
            "firstPreference": "first_preference",
            "secondPreference": "second_preference",
            "fatherName": "father_name",
            "fatherOccupation": "father_occupation",
            "fatherMobile": "father_mobile",
            "motherName": "mother_name",
            "motherOccupation": "mother_occupation",
            "motherMobile": "mother_mobile",
            "studentDeclaration": "student_declaration",
            "parentDeclaration": "parent_declaration",
            "documents": "documents",
        }
        
        # Map the fields
        for frontend_field, model_field in field_mapping.items():
            if frontend_field in data:
                processed_data[model_field] = data[frontend_field]
        
        # Handle IP address and User Agent if available
        if "metadata" in data:
            if "ipAddress" in data["metadata"]:
                processed_data["ip_address"] = data["metadata"]["ipAddress"]
            if "userAgent" in data["metadata"]:
                processed_data["user_agent"] = data["metadata"]["userAgent"]
        
        return processed_data


class ApplicationStatusAPI(APIView):
    def post(self, request):
        try:
            application_id = request.data.get("applicationId")
            contact_number = request.data.get("contactNumber")
            
            if not application_id or not contact_number:
                return Response(
                    {"success": False, "message": "Application ID and contact number are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Find the application
            application = ScholarshipApplication.objects.filter(
                application_id=application_id
            ).filter(
                student_mobile=contact_number
            ).first()
            
            if not application:
                return Response(
                    {"success": False, "message": "No application found with the provided details"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            return Response({
                "success": True,
                "data": {
                    "applicationId": application.application_id,
                    "name": f"{application.first_name} {application.last_name}",
                    "status": application.status,
                    "programType": application.program_type,
                    "firstPreference": application.first_preference,
                    "submittedAt": application.submitted_at,
                }
            })
            
        except Exception as e:
            return Response(
                {"success": False, "message": f"Failed to check application status: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )