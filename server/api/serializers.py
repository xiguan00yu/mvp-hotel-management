from rest_framework import serializers
from .models import Hotel, Room, RoomPrice


class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = ('id', 'name', 'code', 'management')


class RoomPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomPrice
        fields = '__all__'


class RoomSerializer(serializers.ModelSerializer):
    price_list = RoomPriceSerializer(
        many=True, read_only=True)

    class Meta:
        model = Room
        fields = '__all__'
