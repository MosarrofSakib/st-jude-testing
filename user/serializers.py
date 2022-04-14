from .models import UserAccount, UserAccountPasswordAndEmail
from django.contrib.auth import get_user_model
from rest_framework import serializers
from datetime import datetime

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        

        
        fields = ['id','is_superuser','is_secretary','email','first_name','middle_name','last_name','last_login','password']
       

class UserAccountPasswordAndEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccountPasswordAndEmail

        fields = '__all__'