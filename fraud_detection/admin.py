from django.contrib import admin
from .models import SuspiciousTransaction

@admin.register(SuspiciousTransaction)
class SuspiciousTransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'category', 'date', 'is_fraud')
    list_filter = ('is_fraud', 'category')
