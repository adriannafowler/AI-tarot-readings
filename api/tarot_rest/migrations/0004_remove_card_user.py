# Generated by Django 5.0.1 on 2024-06-12 16:50

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("tarot_rest", "0003_card_user_alter_deck_user"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="card",
            name="user",
        ),
    ]
