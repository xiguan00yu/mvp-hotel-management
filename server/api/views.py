from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework import generics
import time
from datetime import date, timedelta

from .models import Hotel, Room, RoomPrice
from .serializers import HotelSerializer, RoomSerializer

from .utils import parse_marriott_rooms


class RoomListView(APIView):
    def get(self, request):
        hotel_id = request.query_params.get('hotel_id', None)
        hotel_code = request.query_params.get('hotel_code', None)
        management = request.query_params.get('management', None)
        from_date = request.query_params.get(
            'fromDate', (date.today() + timedelta(days=1)).strftime('%m/%d/%y'))
        to_date = request.query_params.get(
            'toDate', (date.today() + timedelta(days=2)).strftime('%m/%d/%y'))

        if not management or not hotel_code:
            return Response({'message': 'Missing Hotel parameter'}, status=status.HTTP_400_BAD_REQUEST)

        if management == 'Marriott':
            room_data = parse_marriott_rooms(
                code=hotel_code,
                from_date=from_date,
                to_date=to_date
            )
        else:
            room_data = self.parse_default_rooms()

        search_key = f'{management}-{hotel_code}-{from_date}-{to_date}-{int(time.time())}'
        self.save_rooms_to_database(room_data, hotel_id, search_key=search_key)

        rooms = Room.objects.filter(
            hotel_id=hotel_id, search_key=search_key)

        return Response(RoomSerializer(rooms, many=True).data, status=status.HTTP_200_OK)

    def parse_default_rooms(self):
        # TODO
        return []

    def save_rooms_to_database(self, room_data, hotel_id, search_key):
        for room_info in room_data:
            room = Room.objects.create(
                name=room_info['room_name'], image=room_info['room_image'], hotel=Hotel.objects.get(id=hotel_id), search_key=search_key)

            for price_data in room_info['room_details_list']:
                RoomPrice.objects.create(
                    room=room,
                    actualRoomsAvailable=price_data['actualRoomsAvailable'],
                    priceText=price_data['priceText'],
                    description=price_data['description'],
                    currency=price_data['currency']
                )


class ManagementValuesView(APIView):
    def get(self, request):
        # Retrieve all unique 'management' values
        management_values = Hotel.objects.values_list(
            'management', flat=True).distinct()
        return Response(management_values, status=status.HTTP_200_OK)


class HotelListView(generics.ListAPIView):
    serializer_class = HotelSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        management = self.request.query_params.get('management', None)

        # Query hotels based on 'management' if provided, else get all hotels
        if management:
            hotels = Hotel.objects.filter(
                management=management).order_by('name')
        else:
            hotels = Hotel.objects.all().order_by('name')

        return hotels
