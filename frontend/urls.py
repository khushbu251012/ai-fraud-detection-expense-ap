from django.urls import path
from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('expense/', views.expense_view, name='expense'),
    path('fraud-detection/', views.fraud_detection_view, name='fraud_detection'),
    path('budget-insights/', views.budget_insights_view, name='budget_insights'),
    path('reports-analytics/', views.reports_analytics_view, name='reports_analytics'),
]
