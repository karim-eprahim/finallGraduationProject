from django import forms
from django.contrib.auth.forms import UserCreationForm 
from django.contrib.auth.models import User
from .models import *

class CustomSignupForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User 
        fields = ('username', 'email', 'password1', 'password2')

    def clean_password1(self):
        password1 = self.cleaned_data.get("password1")
        if len(password1) < 8: 
            raise forms.ValidationError("The password is too short.")
        return password1



class LoginForm(forms.Form):
    username = forms.CharField(max_length=50)
    password = forms.CharField(max_length=50, widget=forms.PasswordInput)



class EditProfileForm(forms.ModelForm):
    username =  forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}), required=True, label="Username")
    email = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}), required=True, label="Email")
    class Meta:
        model = User
        fields = ('username', 'email')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].error_messages = {'unique': 'This username is already taken.'}
        self.fields['email'].error_messages = {'unique': 'This email is already taken.'}
        
    
    def save(self, commit=True):
        profile = super().save(commit=False)
        if commit:
            profile.save()
            
        return profile 



class EditPassForm(forms.ModelForm):
    password1 = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}), required=True, label="New password")
    password2 = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}), required=True, label="Password confirmation")

    class Meta:
        model = User
        fields = ('password1', 'password2')
    
    
    def save(self, commit=True):
        profile = super().save(commit=False)   
      
        if commit:
            profile.save()
            
        return profile 

