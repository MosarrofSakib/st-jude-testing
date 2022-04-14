from django.contrib import admin
from .models import UserAccount, UserAccountPasswordAndEmail


admin.site.register(UserAccount)
admin.site.register(UserAccountPasswordAndEmail)

