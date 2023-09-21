import json
from django.db import models
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.utils import timezone


class RoomPrice(models.Model):
    hotel_id = models.ForeignKey(
        'Hotel', on_delete=models.CASCADE, related_name='room_prices')
    hotel_code = models.CharField(max_length=10, blank=True)
    room_name = models.CharField(max_length=200)
    room_image = models.URLField(max_length=200, blank=True)
    room_price = models.DecimalField(max_digits=10, decimal_places=2)
    room_type = models.CharField(max_length=100, blank=True)
    member_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True)
    price_date = models.DateField(blank=True, null=True)
    remaining_quantity = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.room_name} - {self.hotel_id.name}"


class Hotel(models.Model):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=10)
    management = models.CharField(max_length=100)

    def __str__(self):
        return self.name


@receiver(post_migrate)
def create_default_hotels(sender, **kwargs):
    if sender.name == 'api' and not Hotel.objects.filter(management='Hilton').exists():
        with open('data/Hotel.json', 'r') as file:
            data = json.load(file)
            for management, hotels in data.items():
                for item in hotels:
                    Hotel.objects.create(
                        name=item['hotel'],
                        code=item['code'],
                        management=management
                    )
