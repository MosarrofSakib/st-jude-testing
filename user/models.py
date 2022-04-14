from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from datetime import datetime



class UserAccountManager(BaseUserManager):
    def create_user(self, email, first_name,middle_name, last_name,  password=None):

        if not email:
            raise ValueError('Users must have an email')

        email = self.normalize_email(email)
        
        user = self.model(
            email = email,
            first_name = first_name,
            middle_name= middle_name,
            last_name = last_name
        )

        user.set_password(password)
        user.save()

        return user

    def create_secretary(self, email, first_name,middle_name, last_name, password=None):

        user = self.create_user(email, first_name, middle_name,last_name, password)

        user.is_secretary = True

        user.save()

        return user


    def create_superuser(self, email, first_name,middle_name, last_name, password=None):

        user = self.create_user(email, first_name, middle_name,last_name, password)

        user.is_superuser = True
        user.is_staff = True
        user.is_secretary = False
        
        user.save()

        return user




class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, max_length=255)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255,default="")
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_secretary = models.BooleanField(default=False)
    last_login = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    
    def __str__(self):
        return self.email


class UserAccountPasswordAndEmail(models.Model):
    email = models.EmailField(max_length=255)
    password = models.CharField(max_length=255)
    is_secretary = models.BooleanField(default=False)

    def __str__(self):
        return self.email









