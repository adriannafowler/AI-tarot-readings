from django.urls import path
from .views import DeckListView, DeckDetailView, CardListView, CardDetailView

urlpatterns = [
    path('decks/', DeckListView.as_view(), name='decks-list'),
    path('decks/<int:id>/', DeckDetailView.as_view(), name='deck-detail'),
    path('decks/<int:id>/cards/', CardListView.as_view(), name='cards-list'),
    path('decks/<int:deck_id>/cards/<int:card_id>/', CardDetailView.as_view(), name='card-detail'),

]
