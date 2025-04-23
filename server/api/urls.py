# server/api/urls.py
from django.urls import path
from .views import ScholarshipFormAPI, ApplicationStatusAPI

urlpatterns = [
    path("scholarship-form/", ScholarshipFormAPI.as_view(), name="scholarship-form"),
    path("check-status/", ApplicationStatusAPI.as_view(), name="check-status"),
]