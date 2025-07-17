import { useState } from "react";
import { StatusEnum } from "../../../pages/Projects";
import { StatusColor } from "../../../utils/AssignColors";
import penEdit from "../../../assets/pen-edit.png";
import cancel from "../../../assets/cancel.png";
import update from "../../../assets/update.png";

export default function DetailsGridStatus({
  Status,
  handleChange,
  statusAndPriority,
  setStatusAndPriority,
  handleStatusUpdate,
  currentUser,
  headOfProject,
}) {
  const [toggleEdit, setToggleEdit] = useState(false);
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
          <div className="flex flex-col-reverse">
            {!toggleEdit ? (
              <img
                src={penEdit}
                className="h-6 w-6 cursor-pointer transition-all duration-400 ease-in-out hover:scale-125"
                onClick={() => setToggleEdit((prev) => !prev)}
              />
            ) : (
              <select
                name="Status"
                onChange={(e) => handleChange(e)}
                value={statusAndPriority.Status}
                className="border border-gray-300 rounded px-2 py-1 w-[142px]"
              >
                <option disabled value={""}>
                  Select
                </option>
                {Object.entries(StatusEnum)
                  .filter(([key]) => Number(key) !== Status)
                  .map(([key, value]) => (
                    <option key={key} value={Number(key)}>
                      {value}
                    </option>
                  ))}
              </select>
            )}

            {statusAndPriority.Status && toggleEdit && (
              <div className="flex flex-row justify-start mb-1">
                <img
                  src={update}
                  className="w-9 h-6 text-white rounded cursor-pointer px-2 hover:bg-green-200 transition duration-400 ease-in-out lg:mr-2"
                  onClick={() => {
                    setToggleEdit(false);
                    handleStatusUpdate();
                  }}
                />
                <img
                  src={cancel}
                  className="text-red-600 w-8 h-6 rounded-md px-2 py-1 mr-1 sm:mr-0 cursor-pointer transition duration-400 ease-in-out hover:bg-red-100"
                  onClick={() => {
                    setStatusAndPriority((prev) => ({ ...prev, Status: "" }));
                    setToggleEdit(false);
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
