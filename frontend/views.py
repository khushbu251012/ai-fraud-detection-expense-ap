from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required


def home(request):
    return render(request, 'frontend/home.html')

def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']

        if password != confirm_password:
            messages.error(request, "Passwords do not match")
            return render(request, 'frontend/register.html')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists")
            return render(request, 'frontend/register.html')

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already registered")
            return render(request, 'frontend/register.html')

        # Create user
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        return redirect('dashboard')
    return render(request, 'frontend/register.html')


def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, "Invalid username or password")
            return render(request, 'frontend/login.html')
    return render(request, 'frontend/login.html')


@login_required(login_url='/login/')
def dashboard_view(request):
    return render(request, 'frontend/dashboard.html')

@login_required(login_url='/login/')
def expense_view(request):
    return render(request, 'frontend/expense.html')

@login_required(login_url='/login/')
def fraud_detection_view(request):
    return render(request, 'frontend/fraud_detection.html')

@login_required(login_url='/login/')
def budget_insights_view(request):
    return render(request, 'frontend/budget_insights.html')

@login_required(login_url='/login/')
def reports_analytics_view(request):
    return render(request, 'frontend/reports_analytics.html')
