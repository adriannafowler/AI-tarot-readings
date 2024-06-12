from django.urls import path
from .views import DeckListView, DeckDetailView

urlpatterns = [
    path('decks/', DeckListView.as_view(), name='decks-list'),
    path('decks/<int:id>/', DeckDetailView.as_view(), name='deck-detail'),
]
