from rest_framework import serializers
from .models import Hotel, RoomPrice


class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = ('name', 'code', 'management')


class RoomPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomPrice
        fields = '__all__'
