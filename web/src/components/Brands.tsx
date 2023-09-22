import clss from "classnames";
import { useHotelState } from "../Hooks/useHotelState";
import { useHotelManagements } from "../api/hotel";

export const Brands = () => {
  const { currentM, setCurrentManagement } = useHotelState();
  const { isLoading, data } = useHotelManagements();

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex flex-col justify-start gap-4">
          <label className="text-xl font-medium leading-4">Brands</label>
          {isLoading && (
            <div className="flex flex-row items-center">
              <div className="w-24 bg-gray-300 h-8 rounded-md animate-pulse"></div>
              <div className="w-24 bg-gray-300 h-8 rounded-md animate-pulse"></div>
              <div className="w-24 bg-gray-300 h-8 rounded-md animate-pulse"></div>
              <div className="w-24 bg-gray-300 h-8 rounded-md animate-pulse"></div>
            </div>
          )}
          {!isLoading && (
            <div className="tabs tabs-boxed w-fit">
              {data?.map((item) => (
                <a
                  key={item}
                  className={clss("tab", { "tab-active": currentM === item })}
                  onClick={() => setCurrentManagement(item)}
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
