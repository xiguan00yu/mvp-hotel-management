import clss from "classnames";
import { Fragment, useEffect, useState } from "react";
import { useHotelState } from "../Hooks/useHotelState";
import { useHotelList } from "../api/hotel";

export const HotelGrid = () => {
  const { currentM, currentHotelCode, currentHotelText, setCurrentHotel } =
    useHotelState();

  const [page, setPage] = useState(1);

  const { isLoading, data } = useHotelList({
    m: currentM,
    page,
  });

  useEffect(() => {
    setPage(1);
  }, [currentM]);

  useEffect(() => {
    if (
      data != null &&
      data.results?.[0] != null &&
      currentM != null &&
      page === 1
    ) {
      const defaultHotel = data.results?.[0];
      setCurrentHotel(defaultHotel.id, defaultHotel.code, defaultHotel.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, page]);

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex flex-col justify-start gap-8">
          <label className="text-2xl font-medium leading-4">Sub Brands</label>
          {currentHotelText != null && (
            <div className="alert">
              <span className="text-base">
                Selected:
                <a className="link link-primary ml-4 cursor-default no-underline">
                  {currentHotelText}
                </a>
              </span>
            </div>
          )}
          {isLoading && (
            <div className="flex flex-row items-center gap-4">
              <div className="w-24 bg-gray-300 h-8 rounded-md animate-pulse"></div>
              <div className="w-24 bg-gray-300 h-8 rounded-md animate-pulse"></div>
              <div className="w-24 bg-gray-300 h-8 rounded-md animate-pulse"></div>
              <div className="w-24 bg-gray-300 h-8 rounded-md animate-pulse"></div>
            </div>
          )}
          {!isLoading && (
            <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data?.results?.map?.((item, index, array) => (
                <Fragment key={item.id}>
                  {array?.[index - 1]?.name?.[0] != item.name?.[0] && (
                    <div className="col-start-1 col-end-2 md:col-start-1 md:col-end-4 lg:col-start-1 lg:col-end-5">
                      <span className="badge badge-primary">
                        {item.name?.[0]}
                      </span>
                    </div>
                  )}
                  <a
                    id={item.id}
                    className={clss("link link-hover text-sm truncate", {
                      "link-primary": currentHotelCode === item.code,
                    })}
                    onClick={() =>
                      setCurrentHotel(item.id, item.code, item.name)
                    }
                  >
                    {item.name}
                  </a>
                </Fragment>
              ))}
            </div>
          )}
          {!isLoading && (
            <div className="flex flex-row items-center sm:justify-end justify-between gap-4">
              {page !== 1 && (
                <button
                  className="btn btn-link btn-sm"
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Prev
                </button>
              )}
              <button
                className="btn btn-link btn-sm"
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
