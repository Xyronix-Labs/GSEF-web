# server/api/models.py
from django.db import models
from django.utils import timezone

class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Countries"

class City(models.Model):
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='cities')
    
    def __str__(self):
        return f"{self.name}, {self.country.name}"
    
    class Meta:
        verbose_name_plural = "Cities"
        unique_together = ('name', 'country')

class ScholarshipApplication(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Under Review', 'Under Review'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    )
    
    PROGRAM_CHOICES = (
        ('Undergraduate', 'Undergraduate'),
        ('Graduate', 'Graduate'),
        ('PhD', 'PhD'),
        ('Other', 'Other'),
    )
    
    # Application identifiers
    application_id = models.CharField(max_length=20, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    
    # Personal Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    student_mobile = models.CharField(max_length=20)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, null=True, blank=True)
    passport_number = models.CharField(max_length=50, null=True, blank=True)
    
    # Address Information
    address_line1 = models.CharField(max_length=255, null=True, blank=True)
    address_line2 = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    postal_code = models.CharField(max_length=20, null=True, blank=True)
    country = models.CharField(max_length=100)
    nationality = models.CharField(max_length=100, null=True, blank=True)
    
    # Education Information
    highest_education = models.CharField(max_length=100, null=True, blank=True)
    institution_name = models.CharField(max_length=255, null=True, blank=True)
    graduation_year = models.IntegerField(null=True, blank=True)
    gpa = models.CharField(max_length=20, null=True, blank=True)
    
    # Program Information
    program_type = models.CharField(max_length=20, choices=PROGRAM_CHOICES)
    first_preference = models.CharField(max_length=255, null=True, blank=True)
    second_preference = models.CharField(max_length=255, null=True, blank=True)
    
    # Parent/Guardian Information
    father_name = models.CharField(max_length=100, null=True, blank=True)
    father_occupation = models.CharField(max_length=100, null=True, blank=True)
    father_mobile = models.CharField(max_length=20, null=True, blank=True)
    mother_name = models.CharField(max_length=100, null=True, blank=True)
    mother_occupation = models.CharField(max_length=100, null=True, blank=True)
    mother_mobile = models.CharField(max_length=20, null=True, blank=True)
    
    # Documents (store file paths or metadata)
    documents = models.JSONField(null=True, blank=True)
    
    # Declarations
    student_declaration = models.BooleanField(default=False)
    parent_declaration = models.BooleanField(default=False)
    
    # Metadata
    submitted_at = models.DateTimeField(default=timezone.now)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.application_id} - {self.first_name} {self.last_name}"
    
    class Meta:
        ordering = ['-submitted_at']