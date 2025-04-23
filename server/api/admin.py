# server/api/admin.py
from django.contrib import admin
from .models import Country, City, ScholarshipApplication

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'country')
    list_filter = ('country',)
    search_fields = ('name', 'country__name')

@admin.register(ScholarshipApplication)
class ScholarshipApplicationAdmin(admin.ModelAdmin):
    list_display = ('application_id', 'first_name', 'last_name', 'country', 'program_type', 'status', 'submitted_at')
    list_filter = ('status', 'program_type', 'country', 'submitted_at')
    search_fields = ('application_id', 'first_name', 'last_name', 'email', 'student_mobile')
    readonly_fields = ('application_id', 'submitted_at', 'ip_address', 'user_agent')
    fieldsets = (
        ('Application Info', {
            'fields': ('application_id', 'status', 'submitted_at')
        }),
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'email', 'student_mobile', 'date_of_birth', 
                      'gender', 'passport_number', 'nationality')
        }),
        ('Address', {
            'fields': ('address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country')
        }),
        ('Education', {
            'fields': ('highest_education', 'institution_name', 'graduation_year', 'gpa')
        }),
        ('Program Details', {
            'fields': ('program_type', 'first_preference', 'second_preference')
        }),
        ('Parent/Guardian Information', {
            'fields': ('father_name', 'father_occupation', 'father_mobile', 
                      'mother_name', 'mother_occupation', 'mother_mobile')
        }),
        ('Documents', {
            'fields': ('documents',)
        }),
        ('Declarations', {
            'fields': ('student_declaration', 'parent_declaration')
        }),
        ('Metadata', {
            'fields': ('ip_address', 'user_agent'),
            'classes': ('collapse',)
        })
    )