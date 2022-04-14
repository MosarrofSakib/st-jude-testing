from rest_framework import response
from rest_framework import views
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status,permissions, viewsets
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserAccountPasswordAndEmailSerializer
from .models import UserAccountPasswordAndEmail
from django.views import View
from django.http import HttpResponse, HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt 
import os

User = get_user_model()


class Assets(View):

    def get(self, _request, filename):
        path = os.path.join(os.path.dirname(__file__), 'static', filename)

        if os.path.isfile(path):
            with open(path, 'rb') as file:
                return HttpResponse(file.read(), content_type='application/javascript')
        else:
            return HttpResponseNotFound()


class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)
   
    def post(self , request):
        data = request.data 

        first_name = data['first_name']
        middle_name = data['middle_name']
        last_name = data['last_name']
        email = data['email']
        email = email.lower()
        password = data['password']
        re_password = data['re_password']
        is_secretary = data['is_secretary']

        if is_secretary == 'true':
            is_secretary = True
        
        if is_secretary == 'false':
            is_secretary = False

       

        if password == re_password:
            if len(password) >= 8:
                if not User.objects.filter(email=email).exists():
                    if not is_secretary:
                        User.objects.create_superuser(first_name=first_name, middle_name=middle_name,last_name=last_name, email=email, password=password)
                       
                        return Response({'success': 'User Admin Created Successful'}, status=status.HTTP_201_CREATED)
                    else:
                        User.objects.create_secretary(first_name=first_name,middle_name=middle_name,last_name=last_name, email=email, password=password)
                        
                      
                        return Response({'success': 'Secretary User created successful'}, status=status.HTTP_201_CREATED)

                else:
                    return Response({'error': 'User with this email already exist'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Password must atleast 8 characters'}, status=status.HTTP_400_BAD_REQUEST)


        else:
            return Response({'error': 'Password does not Match'}, status=status.HTTP_400_BAD_REQUEST)




class RetrieveUserView(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self,request, format=None):
       
        try:
            user = request.user 
            user = UserSerializer(user)

            return Response(user.data,status=status.HTTP_200_OK)
        except:
            return Response({
                'error':'Something went wrong retreiving the user details'
            },status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class  RetrieveAllUsers(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

    def get_queryset(self):
        patients = User.objects.all()
        return patients

    

class UserAccountEmailAndPasswordViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserAccountPasswordAndEmailSerializer

    def get_queryset(self):
        userAccountsAndPasswords = UserAccountPasswordAndEmail.objects.all()
        return userAccountsAndPasswords

    



    
