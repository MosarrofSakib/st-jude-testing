from rest_framework import urlpatterns
from rest_framework.routers import DefaultRouter
from .views import RegisterView,RetrieveUserView, RetrieveAllUsers,UserAccountEmailAndPasswordViewSet
from django.urls import path,include


router = DefaultRouter()
router.register('users', RetrieveAllUsers, basename="users")
router.register('user-email-and-password', UserAccountEmailAndPasswordViewSet, basename="user-email-and-password")

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('me', RetrieveUserView.as_view()),
    path('', include(router.urls)),
    
]