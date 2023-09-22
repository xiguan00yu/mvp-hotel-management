import { useContext } from "react";
import { HotelContext } from "../context/HotelContext";

export const useHotelState = () => useContext(HotelContext);
