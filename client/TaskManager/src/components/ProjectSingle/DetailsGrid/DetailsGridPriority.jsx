import { PriorityEnum } from "../../../pages/Projects";
import { PriorityColor } from "../../../utils/AssignColors";
import penEdit from "../../../assets/pen-edit.png";
import cancel from "../../../assets/cancel.png";
import update from "../../../assets/update.png";
import { useState } from "react";

export default function DetailsGridPriority({
  Priority,
  handleChange,
  statusAndPriority,
  setStatusAndPriority,
  handleStatusUpdate,
  headOfProject,
  currentUser,
}) {
  const [toggleEdit, setToggleEdit] = useState(false);
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
          <div className="flex flex-col-reverse">
            {!toggleEdit ? (
              <img
                src={penEdit}
                className="h-6 w-6 cursor-pointer transition-all duration-400 ease-in-out hover:scale-125"
                onClick={() => setToggleEdit((prev) => !prev)}
              />
            ) : (
              <select
                name="Priority"
                onChange={(e) => handleChange(e)}
                value={statusAndPriority.Priority}
                className="border border-gray-300 rounded px-2 py-1 w-[142px]"
              >
                <option disabled value={""}>
                  Select
                </option>
                {Object.entries(PriorityEnum)
                  .filter(([key]) => Number(key) !== Priority)
                  .map(([key, value]) => (
                    <option key={key} value={Number(key)}>
                      {value}
                    </option>
                  ))}
              </select>
            )}
            {statusAndPriority.Priority && toggleEdit && (
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
                    setStatusAndPriority((prev) => ({ ...prev, Priority: "" }));
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
