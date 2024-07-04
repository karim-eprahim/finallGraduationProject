from django import forms
from .models import Plants

class PlantForm(forms.ModelForm):
    class Meta:
        model = Plants
        fields = [
            'title',      
            'Temperature',
            'Light_intensity',
            'Soil_moister',
            'Humidity',
            'air_Quality',
            'photo',
        ]

        widgets = {
            'title' : forms.TextInput(attrs={'class':'form-control'}),
            'photo' : forms.FileInput(attrs={'class':'form-control'}),
            'Temperature' : forms.NumberInput(attrs={'class':'form-control'}),
            'Soil_moister' : forms.NumberInput(attrs={'class':'form-control'}),
            'Light_intensity' : forms.NumberInput(attrs={'class':'form-control'}),
            'air_Quality': forms.NumberInput(attrs={'class':'form-control'}),
            'Humidity': forms.NumberInput(attrs={'class':'form-control'}),
            'photo' : forms.FileInput(attrs={'class':'form-control'}),
        }
