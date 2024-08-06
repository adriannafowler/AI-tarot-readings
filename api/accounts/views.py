from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login, logout
from accounts.serializers import LoginSerializer, UserSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
import logging
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.authentication import JWTAuthentication
from tarot_rest.models import Deck, Card
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)


class LoginView(APIView):
    @swagger_auto_schema(
        request_body=LoginSerializer,
        responses={
            200: openapi.Response("Login successful", UserSerializer),
            400: "Invalid credentials",
        },
    )
    def post(self, request):
        logger.debug(f"Login attempt with data: {request.data}")
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)
            login(request, user)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": UserSerializer(user).data,
                }
            )
        logger.debug(f"Login failed with errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={
            204: "Logout successful",
            400: "Invalid refresh token",
            500: "Internal server error",
        },
        security=[{"Bearer": []}],
    )
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()

            logout(request)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(f"Logout failed: {e}")
            return Response(
                {"detail": "Logout failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SignUpView(APIView):
    @swagger_auto_schema(
        request_body=UserSerializer,
        responses={
            201: openapi.Response("User created successfully", UserSerializer),
            400: "Invalid data",
        },
    )
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            admin_user = get_user_model().objects.get(username='admin')  # Ensure this username is correct
            default_deck = Deck.objects.filter(name='Default Deck', user=admin_user).first()
            print("DEFAULT DECK:", default_deck)
            print("DEFAULT CARDS:", Card.objects.filter(deck=default_deck))
            if default_deck:
                # Create a copy of the default deck for the new user
                new_deck = Deck.objects.create(
                    name=default_deck.name,
                    exclude_negative=default_deck.exclude_negative,
                    img_url=default_deck.img_url,
                    user=user
                )

                # Copy cards from the default deck to the new deck
                for card in Card.objects.filter(deck=default_deck):
                    Card.objects.create(
                        name=card.name,
                        image_url=card.image_url,
                        description=card.description,
                        is_negative=card.is_negative,
                        deck=new_deck
                    )

                return Response(
                    {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                        "user": UserSerializer(user).data,
                    },
                    status=status.HTTP_201_CREATED,
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
