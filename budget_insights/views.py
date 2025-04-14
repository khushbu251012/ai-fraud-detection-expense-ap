from rest_framework import generics, permissions
from .models import Budget
from .serializers import BudgetSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from datetime import datetime
from expenses.models import Expense
from rest_framework.response import Response

class BudgetListCreateView(generics.ListCreateAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        print("👤 User creating budget:", self.request.user)
        serializer.save(user=self.request.user)  # 👈 IMPORTANT: auto-fill user

class BudgetRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def budget_summary(request):
    user = request.user
    budgets = Budget.objects.filter(user=user)
    summary = []

    for budget in budgets:
        expenses = Expense.objects.filter(
            user=user,
            category=budget.category,
            date__range=[budget.start_date, budget.end_date]
        )

        total_spent = expenses.aggregate(Sum('amount'))['amount__sum'] or 0
        remaining = budget.amount - total_spent

        summary.append({
            'id': budget.id,
            'category': budget.category,
            'budget': budget.amount,
            'spent': total_spent,
            'remaining': remaining,
            'start_date': budget.start_date,
            'end_date': budget.end_date,
        })

    return Response(summary)
