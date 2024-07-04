from django.shortcuts import render ,redirect, get_object_or_404
from .models import *
from .forms import PlantForm
from django.urls import reverse

def index(request):
    active_plant = Plants.objects.filter(is_active=True).first()
    return render(request,'account/index.html',{'plant': active_plant})
def control(request):
    active_plant = Plants.objects.filter(is_active=True).first()
    return render(request, 'pages/control.html', {'plant': active_plant})
def plants(request):
    if request.method == 'POST':
        add = PlantForm(request.POST, request.FILES)
        if add.is_valid(): 
            add.save()
            return redirect('plants')  

    x = {
        'plants': Plants.objects.all(),
        'form2': PlantForm(),
    }
    return render(request, 'pages/plants.html', x)
def update(request, id):
    plant = get_object_or_404(Plants, id=id)    
    if request.method == 'POST':
        form = PlantForm(request.POST, request.FILES, instance=plant)
        if form.is_valid():
            form.save()
        return redirect ('plants')
    else:
        form = PlantForm( instance=plant )
    context = {
        'form3': form,
    }
    return render(request, 'pages/plants.html', context)
def delete(request, id):
    plant1= get_object_or_404(Plants, id=id)   
    if request.method == 'POST':
            plant1.delete() 
            return redirect ('plants')
    return render(request, 'pages/plants.html')
def active(request , id):
    Plants.objects.update(is_active=False)
    control1= get_object_or_404(Plants, id=id)
    if request.method == 'POST':
       control1.is_active = True
       control1.save()
    return redirect(reverse('control'))
def inactive(request):
    Plants.objects.update(is_active=False)
    return redirect(reverse('plants'))

