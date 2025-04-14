from django.urls import path
from .views import ExpenseListCreateAPIView, ExpenseDetailAPIView
from .views import get_expense_summary

urlpatterns = [
    path('', ExpenseListCreateAPIView.as_view(), name='expense-list-create'), 
    path('<int:pk>/', ExpenseDetailAPIView.as_view(), name='expense-detail'),
    path('summary/', get_expense_summary, name='expense-summary'),
]
