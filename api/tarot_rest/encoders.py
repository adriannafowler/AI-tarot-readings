from common.json import ModelEncoder
from .models import Deck, Card


class DeckEncoder(ModelEncoder):
    model = Deck
    properties = [
        "id",
        "name",
        "exclude_negative",
        "user",
    ]

class CardEncoder(ModelEncoder):
    model = Card
    properties = [
        "id",
        "name",
        "image_url",
        "description",
        "is_negative",
        "deck",
    ]
