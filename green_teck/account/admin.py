from django.contrib import admin
from .models import Profile
admin.site.register(Profile)
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User