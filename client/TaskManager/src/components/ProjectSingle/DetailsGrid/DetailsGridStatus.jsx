import { StatusEnum } from "../../../pages/Projects";
import { StatusColor } from "../../../utils/AssignColors";

export default function DetailsGridStatus({
  Status,
  handleChange,
  statusAndPriority,
  setStatusAndPriority,
  handleStatusUpdate,
  currentUser,
  headOfProject,
}) {
  const statusColor = StatusColor(StatusEnum[Status]);
  const owner = currentUser === headOfProject;

  return (
    <div
      className={`flex flex-col ${
        !owner && "sm:flex-row sm:justify-between"
      } text-gray-500 border-b-1 border-gray-200 md:text-xl md:mb-2`}
    >
      Status
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mt-1 text-black font-semibold">
        <span
          className={`min-w-[74px] ${!owner && "sm:text-end"}`}
          style={{ color: statusColor }}
        >
          {StatusEnum[Status]}
        </span>
        {currentUser === headOfProject && (
          <>
            <select
              name="Status"
              onChange={(e) => handleChange(e)}
              value={statusAndPriority.Status}
              className="border border-gray-300 rounded px-2 py-1 w-[142px]"
            >
              <option disabled value={""}>
                Edit
              </option>
              {Object.entries(StatusEnum)
                .filter(([key]) => Number(key) !== Status)
                .map(([key, value]) => (
                  <option key={key} value={Number(key)}>
                    {value}
                  </option>
                ))}
            </select>

            {statusAndPriority.Status && (
              <div className="flex flex-row justify-between mb-1">
                <button
                  className="bg-green-500 text-white rounded px-2 py-1 hover:bg-green-600 transition lg:mr-2"
                  onClick={handleStatusUpdate}
                >
                  Update
                </button>
                <button
                  className="bg-red-600 font-semibold text-white rounded-md px-2 py-1 mr-1 sm:mr-0 cursor-pointer transition duration-400 ease-in-out hover:bg-red-700"
                  onClick={() =>
                    setStatusAndPriority((prev) => ({ ...prev, Status: "" }))
                  }
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
