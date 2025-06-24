import { PriorityEnum } from "../../../pages/Projects";
import { PriorityColor } from "../../../utils/AssignColors";

export default function DetailsGridPriority({
  Priority,
  handleChange,
  statusAndPriority,
  setStatusAndPriority,
  handleStatusUpdate,
  headOfProject,
  currentUser,
}) {
  const priorityColor = PriorityColor(PriorityEnum[Priority]);
  const owner = currentUser === headOfProject;
  return (
    <div
      className={`flex flex-col ${
        !owner && "sm:flex-row sm:justify-between"
      } text-gray-500 border-b-1 border-gray-200 md:text-xl md:mb-2`}
    >
      Priority
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mt-1 text-black font-semibold">
        <span
          className={`min-w-[74px] ${!owner && "sm:text-end"}`}
          style={{ color: priorityColor }}
        >
          {PriorityEnum[Priority]}
        </span>
        {currentUser === headOfProject && (
          <>
            <select
              name="Priority"
              onChange={(e) => handleChange(e)}
              value={statusAndPriority.Priority}
              className="border border-gray-300 rounded px-2 py-1 w-[142px]"
            >
              <option disabled value={""}>
                Edit
              </option>
              {Object.entries(PriorityEnum)
                .filter(([key]) => Number(key) !== Priority)
                .map(([key, value]) => (
                  <option key={key} value={Number(key)}>
                    {value}
                  </option>
                ))}
            </select>

            {statusAndPriority.Priority && (
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
                    setStatusAndPriority((prev) => ({ ...prev, Priority: "" }))
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
