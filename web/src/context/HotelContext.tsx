import { PropsWithChildren, createContext, useMemo, useState } from "react";

type T = {
  currentHotel: string;
  currentM: string;
};

type TF = {
  setCurrentHotel: (h: string) => void;
  setCurrentManagement: (m: string) => void;
};

const INIT_VALUE = {
  currentM: "Marriott",
  currentHotel: "RKVDR",
};

export const HotelContext = createContext<T & TF>({
  ...INIT_VALUE,
  setCurrentHotel: () => {},
  setCurrentManagement: () => {},
});

export const HotelProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<T>({ ...INIT_VALUE });

  const cValue = useMemo<T & TF>(
    () => ({
      ...state,
      setCurrentHotel: (hotel) =>
        setState((prev) => ({ ...prev, currentHotel: hotel })),
      setCurrentManagement: (m) =>
        setState((prev) => ({ ...prev, currentM: m })),
    }),
    [state]
  );

  return (
    <HotelContext.Provider value={cValue}>{children}</HotelContext.Provider>
  );
};
