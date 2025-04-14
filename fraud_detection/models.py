from django.db import models
from django.contrib.auth.models import User

class SuspiciousTransaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    description = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    amount = models.FloatField()
    is_fraud = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - ₹{self.amount} - Fraud: {self.is_fraud}"
