from django.urls import path
from .views import ItemAPI

urlpatterns = [
    path("items/", ItemAPI.as_view(), name="item-list-create"),
    path("items/<str:pk>/", ItemAPI.as_view(), name="item-detail"),
    path("scholarship-form/", ScholarshipFormAPI.as_view(), name="scholarship-form"),
]