import clss from "classnames";
import { useEffect, useState } from "react";
import { useHotelState } from "../Hooks/useHotelState";
import { useHotelList } from "../api/hotel";

export const HotelGrid = () => {
  const { currentM, currentHotel, setCurrentHotel } = useHotelState();

  const [page, setPage] = useState(1);

  const { isLoading, data } = useHotelList({
    m: currentM,
    page,
  });

  useEffect(() => {
    setPage(1);
  }, [currentM]);

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex flex-col justify-start gap-4">
          <label className="text-xl font-medium leading-4">Sub Brands</label>
          {isLoading && (
            <div className="flex flex-row items-center">
              <div className="w-24 bg-gray-300 h-8 rounded-md animate-pulse"></div>
              <div className="w-24 bg-gray-300 h-8 rounded-md animate-pulse"></div>
              <div className="w-24 bg-gray-300 h-8 rounded-md animate-pulse"></div>
              <div className="w-24 bg-gray-300 h-8 rounded-md animate-pulse"></div>
            </div>
          )}
          {!isLoading && (
            <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[500px]">
              {data?.results?.map?.((item) => (
                <a
                  key={item.id}
                  id={item.id}
                  className={clss("link text-sm", {
                    "link-primary": currentHotel === item.code,
                  })}
                  onClick={() => setCurrentHotel(item.code)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
