from importlib.resources import path
from django.urls import path
from . import views

urlpatterns = [
    path('',views.index,name='index'),  
    path('control.html',views.control,name='control'),
    path('plants.html',views.plants,name='plants'),
    path('update/<int:id>',views.update, name='update'),
    path('delete/<int:id>',views.delete, name='delete'),
    path('plants/active/<int:id>',views.active, name='active'),
    path('inactive.html',views.inactive, name='inactive'),
]
