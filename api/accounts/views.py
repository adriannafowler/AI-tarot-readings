from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from accounts.serializers import LoginSerializer, UserSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.permissions import IsAuthenticated
import logging

logger = logging.getLogger(__name__)

class LoginView(APIView):
    @swagger_auto_schema(
    request_body=LoginSerializer,
    responses={
        200: openapi.Response('Login successful', UserSerializer),
        400: 'Invalid credentials'
        }
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user': UserSerializer(user).data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)

class SignUpView(APIView):
    @swagger_auto_schema(
    request_body=UserSerializer,
    responses={
        201: openapi.Response('User created successfully', UserSerializer),
        400: 'Invalid data'
        }
    )
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        logger.debug('SERIALIZER!!!!!:', serializer)
        if serializer.is_valid():
            user = User.objects.create_user(**serializer.validated_data)
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logger.debug(f"USER: {request.user}")
        logger.debug(f"AUTH: {request.auth}")
        user = request.user
        logger.debug("USER!!!!:", UserSerializer(user).data)
        return Response(UserSerializer(user).data)
        # return Response(status=status.HTTP_401_UNAUTHORIZED)
