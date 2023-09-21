from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework import generics

from .models import Hotel, RoomPrice
from .serializers import HotelSerializer, RoomPriceSerializer


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class RoomListView(APIView):
    def get(self, request):
        hotel_id = request.query_params.get('hotel_id', None)
        hotel_code = request.query_params.get('hotel_code', None)
        management = request.query_params.get('management', None)

        if not management or not hotel_code:
            return Response({'message': 'Missing Hotel parameter'}, status=status.HTTP_400_BAD_REQUEST)

        if management == 'Marriott':
            room_data = self.parse_marriott_rooms()
        else:
            room_data = self.parse_default_rooms()

        self.save_rooms_to_database(room_data, hotel_id, hotel_code)

        rooms = RoomPrice.objects.filter(
            hotel_id=hotel_id, hotel_code=hotel_code)

        return Response(RoomPriceSerializer(rooms, many=True).data, status=status.HTTP_200_OK)

    def parse_marriott_rooms(self):
        # TODO
        return []

    def parse_default_rooms(self):
        # TODO
        return []

    def save_rooms_to_database(self, room_data, hotel_id, hotel_code):
        for room_info in room_data:
            RoomPrice.objects.update_or_create(
                hotel_id=hotel_id,
                hotel_code=hotel_code,
                room_name=room_info['room_name'],
                defaults=room_info
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
