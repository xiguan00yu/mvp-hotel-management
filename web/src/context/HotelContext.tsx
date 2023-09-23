import { PropsWithChildren, createContext, useMemo, useState } from "react";

type T = {
  currentHotelId: string | null;
  currentHotelCode: string | null;
  currentHotelText: string | null;
  currentM: string | null;
};

type TF = {
  setCurrentHotel: (id: string, code: string, text: string) => void;
  setCurrentManagement: (m: string) => void;
};

const INIT_VALUE = {
  currentM: null,
  currentHotelId: null,
  currentHotelCode: null,
  currentHotelText: null,
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
      setCurrentHotel: (id, code, text) =>
        setState((prev) => ({
          ...prev,
          currentHotelId: id,
          currentHotelCode: code,
          currentHotelText: text,
        })),
      setCurrentManagement: (m) =>
        setState((prev) => ({ ...prev, currentM: m })),
    }),
    [state]
  );

  return (
    <HotelContext.Provider value={cValue}>{children}</HotelContext.Provider>
  );
};
