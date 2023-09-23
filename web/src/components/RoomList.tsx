import dayjs from "dayjs";
import { useHotelState } from "../Hooks/useHotelState";
import { useHotelRooms } from "../api/hotel";
import { Fragment, useState } from "react";
import DatePicker, { DateValueType } from "react-tailwindcss-datepicker";

const INVALID_MS = ["Hilton", "Hyatt", "IHG"];

export const RoomList = () => {
  const [checkInTime, setCheckInTime] = useState<DateValueType>({
    startDate: dayjs().add(1, "day").toDate(),
    endDate: dayjs().add(2, "day").toDate(),
  });

  const { currentM, currentHotelId, currentHotelCode } = useHotelState();
  const { isLoading, data, isRefetching, isError, refetch } = useHotelRooms({
    m: currentM,
    hotelId: currentHotelId,
    hotelCode: currentHotelCode,
    fromDate: dayjs(checkInTime?.startDate).format("MM/DD/YY"),
    toDate: dayjs(checkInTime?.endDate).format("MM/DD/YY"),
  });
  return (
    <Fragment>
      <div id="room-list" className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex flex-col justify-start gap-4">
            <label className="text-2xl font-medium leading-8">Rooms</label>
            <div className="flex flex-row items-center justify-start gap-4">
              <label className="text-base font-normal">Check-in Time</label>
              <div className="border rounded flex-auto">
                <DatePicker
                  minDate={dayjs().add(1, "day").toDate()}
                  value={checkInTime}
                  onChange={(value) => value != null && setCheckInTime(value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* insupport room seach */}
      {currentM != null && INVALID_MS.includes(currentM) && (
        <div className="hero py-10 bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-lg">
              <h1 className="text-5xl font-bold">Coming Soon</h1>
              <p className="py-6">
                We are working hard to bring you this amazing feature. It's not
                available just yet, but stay tuned for updates!
              </p>
            </div>
          </div>
        </div>
      )}
      {isRefetching && (
        <div className="flex flex-row justify-center items-center">
          <span className="loading loading-ball loading-lg"></span>
          <span className="loading loading-ball loading-md"></span>
          <span className="loading loading-ball loading-md"></span>
          <span className="loading loading-ball loading-lg"></span>
        </div>
      )}
      {/* get data = empty */}
      {currentM != null &&
        !INVALID_MS.includes(currentM) &&
        !isLoading &&
        !isRefetching &&
        (data?.length === 0 || isError) && (
          <div className="hero py-10 bg-base-200">
            <div className="hero-content text-center">
              <div className="max-w-lg">
                <h1 className="text-5xl font-bold">Service Unstable</h1>
                <p className="py-6">
                  We apologize, but our service may experience instability, and
                  requests might not always go through. If you encounter issues,
                  please try clicking the "Retry" button or contact the
                  developer for assistance.
                </p>
                <button className="btn btn-primary" onClick={() => refetch()}>
                  Retry
                </button>
                <p className="text-sm text-gray-500">
                  If the issue persists, please contact the developer.
                </p>
              </div>
            </div>
          </div>
        )}
      {/* list */}
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 grid-cols-1 gap-4 mb-10">
        {/* loading */}
        {isLoading && (
          <Fragment>
            {[1, 2].map((item) => (
              <div
                key={item}
                className="card card-compact bg-base-100 shadow-xl"
              >
                <figure>
                  <div className="bg-gray-300 animate-pulse w-full h-[157px]" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    <div className="w-24 bg-gray-300 h-8 rounded-md animate-pulse"></div>
                  </h2>
                  <div className="w-full bg-gray-300 h-4 rounded-md animate-pulse"></div>
                  <div className="w-full bg-gray-300 h-4 rounded-md animate-pulse"></div>
                </div>
              </div>
            ))}
          </Fragment>
        )}
        {!isLoading &&
          data?.map((item) => (
            <div
              key={item.id}
              className="card card-compact bg-base-100 shadow-xl"
            >
              <figure>
                <img width={"100%"} src={item.image} alt="room image" />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-base">{item.name}</h2>
                <div className="flex flex-col">
                  {item?.price_list?.map?.((price) => (
                    <div
                      className={
                        "flex flex-row gap-4 justify-between items-baseline hover:underline cursor-pointer"
                      }
                    >
                      <span className="text-base leading-10">
                        {price.description}
                      </span>
                      <span className="text-base leading-10">
                        {price.currency} /{" "}
                        <span className="text-3xl font-semibold">
                          {price.priceText}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </Fragment>
  );
};
