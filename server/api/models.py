import json
from django.db import models
from django.db.models.signals import post_migrate
from django.dispatch import receiver


class Room(models.Model):
    name = models.CharField(max_length=200)
    image = models.URLField(null=True, blank=True)
    hotel = models.ForeignKey('Hotel', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    search_key = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class RoomPrice(models.Model):
    room = models.ForeignKey(
        Room, related_name='price_list', on_delete=models.CASCADE)
    actualRoomsAvailable = models.CharField(max_length=10)
    priceText = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    currency = models.CharField(max_length=10)

    def __str__(self):
        return f"Price for {self.room.name}"


class Hotel(models.Model):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=10)
    management = models.CharField(max_length=100)

    def __str__(self):
        return self.name


@receiver(post_migrate)
def create_default_hotels(sender, **kwargs):
    if sender.name == 'api':
        try:
            if Hotel.objects.filter(management='Hilton').exists():
                return
        except Exception as e:
            pass
        with open('data/Hotel.json', 'r') as file:
            data = json.load(file)
            for management, hotels in data.items():
                for item in hotels:
                    Hotel.objects.create(
                        name=item['hotel'],
                        code=item['code'],
                        management=management
                    )
