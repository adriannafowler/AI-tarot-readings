from django.db import models
from django.conf import settings

class Deck(models.Model):
    name = models.CharField(max_length=150)
    exclude_negative = models.BooleanField(default=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="recipes",
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
