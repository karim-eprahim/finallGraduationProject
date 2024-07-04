from django.urls import path
from. import views

urlpatterns = [
    path('signin.html', views.signin, name='signin'),
    path('signup.html', views.signup, name='signup'),
    path('logout.html', views.logout, name= 'logout'),
    path('profile.html', views.profile, name= 'profile'),
    path('edit.html',views.edit, name='edit'),
    path('password.html',views.password, name='password'),
]
