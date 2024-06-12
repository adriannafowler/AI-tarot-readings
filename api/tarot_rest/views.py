from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Deck, Card
from .serializers import DeckSerializer, CardSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class DeckListView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={
            200: openapi.Response('List of user decks', DeckSerializer(many=True)),
            401: 'Unauthorized'
        },
        security=[{'Bearer': []}]
    )
    def get(self, request):
        decks = Deck.objects.filter(user=request.user)
        serializer = DeckSerializer(decks, many=True)
        return Response({"decks": serializer.data}, status=status.HTTP_200_OK)

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
            serializer.save()
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
