from django.urls import path
from .views import DeckListView

urlpatterns = [
    path('decks/', DeckListView.as_view(), name='decks-list'),
]
