from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField

class Deck(models.Model):
    name = models.CharField(max_length=150)
    exclude_negative = models.BooleanField(default=True)
    img_url = models.URLField(null=True, blank=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="decks",
        on_delete=models.CASCADE,
        null=True,
    )

    def __str__(self):
        return self.name


class Card(models.Model):
    name = models.CharField(max_length=150)
    image_url = models.URLField()
    description = models.TextField()
    is_negative = models.BooleanField(default=False)
    deck = models.ForeignKey(
        Deck,
        related_name="cards",
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return self.name

class Reading(models.Model):
    time_stamp = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=150, null=True, blank=True)
    cards = models.ManyToManyField(Card)
    reading = models.TextField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="readings",
        on_delete=models.CASCADE,
        null=True,
    )
