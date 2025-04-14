from rest_framework import serializers
from .models import SuspiciousTransaction

class SuspiciousTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuspiciousTransaction
        fields = '__all__'
        read_only_fields = ['user', 'is_fraud']
