from django.urls import path
from .views import BudgetListCreateView, BudgetRetrieveUpdateDeleteView, budget_summary

urlpatterns = [
    path('', BudgetListCreateView.as_view(), name='budget-list-create'),
    path('<int:pk>/', BudgetRetrieveUpdateDeleteView.as_view(), name='budget-detail'),
    path('summary/', budget_summary, name='budget-summary'),
]
