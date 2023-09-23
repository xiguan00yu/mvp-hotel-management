import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useHotelManagements = () => {
  return useQuery<Array<string>>({
    queryKey: ["hotel-managements"],
    queryFn: async () => {
      const { data } = await axios.get("/api/hotel-managements");
      return data;
    },
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
      const { data } = await axios.get(
        `/api/hotels?page=${page}&management=${m}`
      );
      return data;
    },
    enabled: m != null,
  });
};
