from django.urls import path
from .views import ReceiptPDF

urlpatterns = [
    path('report/', ReceiptPDF, name='report'),
]