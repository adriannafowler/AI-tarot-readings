from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Deck, Card, Reading
from .serializers import DeckSerializer, CardSerializer, ReadingSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .acls import get_reading
import random
# from rest_framework.authtoken.models import Token
import logging
from rest_framework_simplejwt.authentication import JWTAuthentication

logger = logging.getLogger(__name__)

class DeckListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={
            200: openapi.Response('List of user decks', DeckSerializer(many=True)),
            401: 'Unauthorized'
        },
        security=[{'Bearer': []}]
    )
    def get(self, request):
        logger.debug(f"USER: {request.user}")
        logger.debug(f"AUTH HEADER: {request.headers.get('Authorization')}")
        logger.debug(f"USER AUTHENTICATED?: {request.user.is_authenticated}")
        if request.user.is_authenticated:
            decks = Deck.objects.filter(user=request.user)
            serializer = DeckSerializer(decks, many=True)
            return Response({"decks": serializer.data}, status=status.HTTP_200_OK)
        logger.debug("User not authenticated")
        return Response({"detail": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

    @swagger_auto_schema(
        request_body=DeckSerializer,
        responses={
            201: openapi.Response('Deck created successfully', DeckSerializer),
            400: 'Invalid data',
            401: 'Unauthorized'
        },
        security=[{'Bearer': []}]
    )
    def post(self, request):
        serializer = DeckSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeckDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={
            201: openapi.Response('Deck updated successfully', DeckSerializer),
            401: 'Unauthorized',
            404: 'Not Found'
        },
        security=[{'Bearer': []}]
    )

    def get(self, request, id):
        try:
            deck = Deck.objects.get(id=id, user=request.user)
            serializer = DeckSerializer(deck)
            return Response({"deck": serializer.data}, status=status.HTTP_200_OK)
        except Deck.DoesNotExist:
            return Response({"detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        request_body=DeckSerializer,
        responses={
            201: openapi.Response('Deck updated successfully', DeckSerializer),
            400: 'Invalid data',
            401: 'Unauthorized'
        },
        security=[{'Bearer': []}]
    )

    def put(self, request, id):
        try:
            deck = Deck.objects.get(id=id, user=request.user)
        except Deck.DoesNotExist:
            return Response({"detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = DeckSerializer(deck, data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({"deck": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
    responses={
        200: openapi.Response('Deck deleted', DeckSerializer),
        401: 'Unauthorized'
    },
    security=[{'Bearer': []}]
    )

    def delete(self, request, id):
        try:
            deck = Deck.objects.get(id=id, user=request.user)
            count, _ = deck.delete()
            return Response({"deleted": count > 0})
        except Deck.DoesNotExist:
            return Response({"detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

class CardListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={
            200: openapi.Response('List of deck cards', CardSerializer(many=True)),
            401: 'Unauthorized'
        },
        security=[{'Bearer': []}]
    )

    def get(self,request, id):
        cards = Card.objects.filter(deck=id, deck__user=request.user)
        serializer = CardSerializer(cards, many=True)
        return Response({"cards": serializer.data}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        request_body=CardSerializer,
        responses={
            201: openapi.Response('Card created successfully', CardSerializer),
            400: 'Invalid data',
            401: 'Unauthorized'
        },
        security=[{'Bearer': []}]
    )

    def post(self, request, id):
        try:
            deck = Deck.objects.get(id=id, user=request.user)
        except:
            return Response({"card": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(deck=deck)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CardDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={
            201: openapi.Response('Deck updated successfully', DeckSerializer),
            401: 'Unauthorized',
            404: 'Not Found'
        },
        security=[{'Bearer': []}]
    )

    def get(self, request, card_id, deck_id):
        try:
            card = Card.objects.get(id=card_id, deck__id=deck_id, deck__user=request.user)
            serializer = CardSerializer(card)
            return Response({"card": serializer.data}, status=status.HTTP_200_OK)
        except Card.DoesNotExist:
            return Response({"card detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
    @swagger_auto_schema(
        request_body=CardSerializer,
        responses={
            201: openapi.Response('Card updated successfully', CardSerializer),
            400: 'Invalid data',
            401: 'Unauthorized'
        },
        security=[{'Bearer': []}]
    )

    def put(self, request, card_id, deck_id):
        try:
            card = Card.objects.get(id=card_id, deck__id=deck_id, deck__user=request.user)
        except Card.DoesNotExist:
            return Response({"card": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CardSerializer(card, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"card": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        responses={
            200: openapi.Response('Card deleted', CardSerializer),
            401: 'Unauthorized'
        },
        security=[{'Bearer': []}]
    )

    def delete(self, request, card_id, deck_id):
        try:
            card = Card.objects.get(id=card_id, deck__id=deck_id, deck__user=request.user)
            count, _ = card.delete()
            return Response({"deleted": count > 0})
        except Card.DoesNotExist:
            return Response({"card": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

class ReadingListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={
            200: openapi.Response('List of user readings', ReadingSerializer(many=True)),
            401: 'Unauthorized'
        },
        security=[{'Bearer': []}]
    )
    def get(self, request):
        readings = Reading.objects.filter(user=request.user)
        serializer = ReadingSerializer(readings, many=True)
        return Response({"readings": serializer.data}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'deck_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the deck'),
            },
            required=['deck_id']
        ),
        responses={
            201: openapi.Response('Reading created successfully', ReadingSerializer),
            400: 'Invalid data',
            401: 'Unauthorized'
        },
        security=[{'Bearer': []}]
    )
    def post(self, request):
        deck_id = request.data.get('deck_id')
        if not deck_id:
            return Response({"deck_id": "This field is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            deck = Deck.objects.get(id=deck_id, user=request.user)
        except Deck.DoesNotExist:
            return Response({"detail": "Deck not found."}, status=status.HTTP_404_NOT_FOUND)

        cards = Card.objects.filter(deck=deck)
        if cards.count() < 3:
            return Response({"detail": "Not enough cards in the deck."}, status=status.HTTP_400_BAD_REQUEST)
        random_cards = random.sample(list(cards), 3)
        d = {}
        chosen_card_ids = []
        for i in range(len(random_cards)):
            d[f"card{i + 1}"] = f"{random_cards[i].name} - {random_cards[i].description}"
            chosen_card_ids.append(random_cards[i].id)
        reading = get_reading(d)

        reading_data = {
            "title": request.data.get("title"),
            "reading": reading,
            "cards": chosen_card_ids,
            "user": request.user.id
        }

        serializer = ReadingSerializer(data=reading_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReadingDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={
            201: openapi.Response('Reading updated successfully', ReadingSerializer),
            401: 'Unauthorized',
            404: 'Not Found'
        },
        security=[{'Bearer': []}]
    )

    def get(self, request, id):
        try:
            reading = Reading.objects.get(id=id, user=request.user)
            serializer = ReadingSerializer(reading)
            return Response({"reading": serializer.data}, status=status.HTTP_200_OK)
        except Deck.DoesNotExist:
            return Response({"reading detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'title': openapi.Schema(type=openapi.TYPE_STRING, description='Title of the reading'),
            },
            required=['title']
        ),
        responses={
            200: openapi.Response('Reading updated successfully', ReadingSerializer),
            400: 'Invalid data',
            401: 'Unauthorized',
            404: 'Not Found'
        },
        security=[{'Bearer': []}]
    )

    def patch(self, request, id):
        try:
            reading = Reading.objects.get(id=id, user=request.user)
        except Reading.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        title = request.data.get('title')
        if not title:
            return Response({"title": "This field is required."}, status=status.HTTP_400_BAD_REQUEST)

        reading.title = title
        reading.save()

        serializer = ReadingSerializer(reading)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, id):
        try:
            reading = Reading.objects.get(id=id, user=request.user)
            count, _ = reading.delete()
            return Response({"deleted": count > 0})
        except Reading.DoesNotExist:
            return Response({"reading detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
