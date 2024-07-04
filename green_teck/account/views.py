from django.shortcuts import render, redirect
from django.contrib import auth
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import check_password
from .forms import *
from pages.forms import Plants
from django.contrib import messages
from django.contrib import *
from django.contrib.auth.models import User

def signup(request):
    if request.method == 'POST':
        form = CustomSignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data['username']           
            password = form.cleaned_data['password1']
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, 'Now you have an account...Sign in please.')
                return redirect('signin')
        else:
            if 'username' in form.errors:
                messages.error(request, 'The username is invalid...Try another one')
            elif 'email' in form.errors:
                messages.error(request, 'The email is invalid...Try another one')
            elif 'password2' in form.errors:
                    if form.errors['password2'] == ['The two password fields didn’t match.']:
                        messages.warning(request, "Passwords don't match...Try again.")
            else:
                for error in form.errors['password1']:
                    if "too short" in error:
                        messages.error(request, "password must be at least 8 characters")
        return render(request, 'account/signup.html', {'form': form})
    else:
        form = CustomSignupForm()
    return render(request, 'account/signup.html', {'form': form})

def signin(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('index')
        else:
            if not User.objects.filter(username=username).exists():
                messages.error(request, 'Invalid username...Try again.')
            elif not authenticate(request, username=username, password=password):
                messages.error(request, 'Invalid password...Try again.')
            return redirect('signin')
    form = LoginForm()
    return render(request, 'account/signin.html', {'form': form})

def logout(request):
    if request.user.is_authenticated:
        auth.logout(request)
    return redirect('index') 
def profile(request):
    user_count = User.objects.count()
    plant_count = Plants.objects.count()
    context = {
        'user_count': user_count,
        'plant_count': plant_count,
    }
    return render(request, 'account/profile.html', context)

def edit(request):
    if request.method == 'POST':
        form = EditProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            if User.objects.filter(username=username).exclude(pk=request.user.pk).exists():
                messages(request, 'This username is already taken.')
                return render(request, 'account/edit.html', {'form4': form})
            elif User.objects.filter(email=email).exclude(pk=request.user.pk).exists():
                messages.error(request, 'This email is already taken.')
                return render(request, 'account/edit.html', {'form4': form})
            
            user = form.save()
            login(request, user)
            return redirect('profile')
    else:
        form = EditProfileForm(instance=request.user)

    return render(request, 'account/edit.html', {'form4': form})

def password(request):
    if request.method == 'POST':
        form = EditPassForm(request.POST, instance=request.user)
        if form.is_valid():
            password1 = form.cleaned_data.get('password1')
            password2 = form.cleaned_data.get('password2')
            if len(password1) < 8:
                messages.error(request, "password must be at least 8 characters")
                return render(request, 'account/pass.html', {'form5': form})
            elif password1 != password2:
                messages.warning(request, "Passwords don't match!")
                return render(request, 'account/pass.html', {'form5': form})
            elif check_password(password1, request.user.password):
                messages.error(request, "The password is the same as your current password!")
                return render(request, 'account/pass.html', {'form5': form})
            else:  
                user = form.save(commit=False)
                user.set_password(password1)
                user.save()
                login(request, user)  
                messages.success(request, 'Your password has been updated! Please sign in again.')
                return redirect('signin')
    else:
        form = EditPassForm(instance=request.user)

    return render(request, 'account/pass.html', {'form5': form})


