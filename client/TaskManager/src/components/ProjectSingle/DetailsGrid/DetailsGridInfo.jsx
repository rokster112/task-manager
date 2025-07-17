import { TransformDate } from "../../../utils/TransformDate";

export default function DetailsGridInfo({
  StartDate,
  EndDate,
  CreatedAt,
  ClientName,
}) {
  return (
    <>
      <p className="flex flex-col sm:flex-row text-gray-500 border-b-1 border-gray-200 md:text-xl sm:justify-between md:mb-2">
        Start
        <span className="text-black font-semibold">
          {TransformDate(StartDate)}
        </span>
      </p>
      <p className="flex flex-col sm:flex-row text-gray-500 border-b-1 border-gray-200 md:text-xl sm:justify-between md:mb-2">
        Deadline
        <span className="text-black font-semibold">
          {TransformDate(EndDate)}
        </span>
      </p>
      <p className="flex flex-col sm:flex-row text-gray-500 border-b-1 border-gray-200 md:text-xl sm:justify-between md:mb-2">
        Client Name
        <span className="text-black font-semibold sm:text-end">
          {ClientName ? ClientName : "N/A"}
        </span>
      </p>
      <p className="flex flex-col sm:flex-row text-gray-500 border-b-1 border-gray-200 md:text-xl sm:justify-between md:mb-2">
        Created
        <span className="text-black font-semibold">
          {TransformDate(CreatedAt)}
        </span>
      </p>
    </>
  );
}
