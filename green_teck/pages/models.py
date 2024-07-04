from django.db import models

class Plants (models.Model):
    title = models.CharField(max_length=50, null = True)
    Temperature = models.IntegerField()
    Soil_moister = models.IntegerField()
    Light_intensity = models.IntegerField()
    Humidity = models.IntegerField(null=True)
    air_Quality= models.IntegerField(null=True)
    photo = models.ImageField(upload_to='IMAGES',null=True)
    is_active = models.BooleanField(default=False)
    def __str__(self):
        return self.title
