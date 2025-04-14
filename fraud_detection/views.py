from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .utils import is_suspicious_transaction
from .models import SuspiciousTransaction
from .serializers import SuspiciousTransactionSerializer
from twilio.rest import Client

class CheckFraudAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data
        amount = float(data.get('amount'))

        is_fraud = is_suspicious_transaction(amount)

        transaction = SuspiciousTransaction.objects.create(
            user=user,
            date=data.get('date'),
            description=data.get('description'),
            category=data.get('category'),
            amount=amount,
            is_fraud=is_fraud
        )

        # 🚨 Send SMS if fraud
        if is_fraud:
            send_sms_alert(user.username, amount)

        serializer = SuspiciousTransactionSerializer(transaction)
        return Response({"is_fraud": is_fraud, "data": serializer.data})


def send_sms_alert(username, amount):
    # 🟣 Twilio config (replace with your actual credentials)
    account_sid = 'AC87d8378395f630cee48c05618a84e103'
    auth_token = '01ad9fbb5b200b74570bb31828a86552'
    client = Client(account_sid, auth_token)

    message = client.messages.create(
        body=f"🚨 Alert! Suspicious Transaction Detected for {username}. Amount: ₹{amount}",
        from_='+12184605593',
        to='+919924260163'
    )
