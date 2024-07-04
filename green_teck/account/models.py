from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver 

class Profile(models.Model):
    user = models.OneToOneField(User , on_delete=models.CASCADE)
    email = models.CharField(max_length=50, null=True)
    password = models.CharField(max_length=50, null=True)


    def _str_(self):
        return str (self.user)
@receiver(post_save,sender=User)    
def user_profile(sender,instance,created,**kwargs):
    if created :
        Profile.objects.create(
            user=instance
        )