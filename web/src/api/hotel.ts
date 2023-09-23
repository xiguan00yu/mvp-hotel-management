import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useHotelManagements = () => {
  return useQuery<Array<string>>({
    queryKey: ["hotel-managements"],
    queryFn: async () => {
      const { data } = await axios.get("/api/hotel-managements");
      return data;
    },
    staleTime: Infinity,
  });
};

type PageResult<T> = {
  count: number;
  next: string;
  previous: string;
  results: T[];
};

export const useHotelList = (props: { m: string | null; page: number }) => {
  const { m, page } = props;
  return useQuery<
    PageResult<{
      id: string;
      name: string;
      code: string;
    }>
  >({
    queryKey: ["hotel-list", m, page],
    keepPreviousData: true,
    queryFn: async () => {
      const { data } = await axios.get(`/api/hotels`, {
        params: {
          page,
          management: m,
        },
      });
      return data;
    },
    enabled: m != null,
  });
};

type RomPrice = {
  id: string;
  actualRoomsAvailable: string;
  currency: string;
  description: string;
  priceText: string;
};

type Room = {
  id: number;
  image: string;
  name: string;
  price_list: RomPrice[];
};

export const useHotelRooms = (props: {
  m: string | null;
  hotelCode: string | null;
  hotelId: string | null;
  fromDate: string;
  toDate: string;
}) => {
  const { m, hotelCode, hotelId, fromDate, toDate } = props;
  return useQuery<Room[]>({
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    queryKey: ["hotel-rooms", m, hotelCode, hotelId, fromDate, toDate],
    keepPreviousData: true,
    queryFn: async () => {
      const { data } = await axios.get(`/api/hotel-rooms`, {
        params: {
          management: m,
          hotel_id: hotelId,
          hotel_code: hotelCode,
          from_date: fromDate,
          to_date: toDate,
        },
      });
      return data;
    },
    // enabled: false
    enabled: m != null && hotelId != null && hotelCode != null,
  });
};
