from django.contrib import admin
from .models import Card, Deck


class CardInline(admin.TabularInline):
    model = Card
    extra = 1

@admin.register(Deck)
class DeckAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "id"
    ]
    inlines = [CardInline]
