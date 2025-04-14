from django.urls import path
from .views import CheckFraudAPIView

urlpatterns = [
    path('check/', CheckFraudAPIView.as_view(), name='check-fraud'),
]
