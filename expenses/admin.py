from django.contrib import admin
from .models import Expense

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'amount', 'category', 'description', 'date']
    search_fields = ['user__username', 'category', 'description']
    list_filter = ['category', 'date']
