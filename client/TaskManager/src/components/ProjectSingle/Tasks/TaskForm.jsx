import { useNavigate } from "react-router-dom";
import { PriorityEnum, StatusEnum } from "../../../pages/Projects";
import { HandleChange } from "../../../utils/HandleChange";
import { RemoveMember } from "../../../utils/RemoveMember";
import { FetchMemberData } from "../../../utils/FetchMemberData";

export default function TaskForm({
  formData,
  setFormData,
  handleSubmit,
  submitLabel,
  token,
  id,
  setErr,
  err,
  members,
  setMembers,
  toggleMembers,
  setToggleMembers,
  taskId,
}) {
  const navigate = useNavigate();
  console.log("From the form", formData);
  const sss =
    toggleMembers &&
    formData.AssignedForIds.length > 0 &&
    members
      .filter((m) => formData.AssignedForIds.includes(m.UserId))
      .map((m) => m.FullName);
  console.log("sss =>", sss);
  return (
    <div className="flex flex-col items-center px-4 sm:px-8 py-6 w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
      {submitLabel === "Update Task" && (
        <button
          className="self-end text-gray-400 hover:text-gray-800 transition text-2xl mb-2 cursor-pointer"
          onClick={() => navigate(-1)}
          aria-label="Close"
        >
          &times;
        </button>
      )}

      <h1 className="text-3xl sm:text-4xl font-bold text-dark-blue mb-6">
        {submitLabel}
      </h1>

      <form
        className="flex flex-col w-full gap-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <input
          type="text"
          name="Title"
          value={formData.Title}
          onChange={(e) => HandleChange(e, setErr, setFormData)}
          placeholder="Task Title"
          className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <textarea
          name="Description"
          value={formData.Description}
          onChange={(e) => HandleChange(e, setErr, setFormData)}
          placeholder="Task Description"
          rows={5}
          className="border border-gray-300 rounded-md px-3 py-2 w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <input
          // required
          type="date"
          name="DueBy"
          value={formData.DueBy}
          onChange={(e) => HandleChange(e, setErr, setFormData)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <button
          type="button"
          onClick={() =>
            setToggleMembers((prev) => {
              const toggle = !prev;
              if (toggle)
                FetchMemberData(id, token, setMembers, setErr, taskId);
              return toggle;
            })
          }
          className="self-start px-4 py-2 bg-custom-purple text-white rounded-md hover:bg-indigo-600 transition cursor-pointer"
        >
          {toggleMembers ? "Hide Members" : "Assign Members"}
        </button>

        {toggleMembers && (
          <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
            {members.length > 0 &&
            members.length > formData.AssignedForIds.length ? (
              members
                .filter((m) => !formData.AssignedForIds.includes(m.UserId))
                .map((m) => (
                  <div
                    key={m.UserId}
                    data-value={m.UserId}
                    data-name={"AssignedForIds"}
                    onClick={(e) => HandleChange(e, setErr, setFormData)}
                    className="cursor-pointer hover:underline text-gray-700"
                  >
                    {m.FullName}
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500">No members to assign</p>
            )}
          </div>
        )}

        <select
          required
          value={formData.Priority}
          onChange={(e) => HandleChange(e, setErr, setFormData)}
          name="Priority"
          className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value={0} disabled>
            -- Select Priority --
          </option>
          {Object.entries(PriorityEnum).map(([key, val]) => (
            <option key={key} value={key}>
              {val}
            </option>
          ))}
        </select>
        <select
          required
          value={formData.Status}
          onChange={(e) => HandleChange(e, setErr, setFormData)}
          name="Status"
          className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value={0} disabled>
            -- Select Status --
          </option>
          {Object.entries(StatusEnum).map(([key, val]) => (
            <option key={key} value={key}>
              {val}
            </option>
          ))}
        </select>
        {err && (
          <p className="text-red-600 text-sm font-medium">
            {err.response?.data || err.message || "Something went wrong"}
          </p>
        )}

        <button
          type="submit"
          className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition cursor-pointer"
        >
          Submit
        </button>

        {formData.AssignedForIds.length > 0 && toggleMembers && (
          <div className="mt-4 space-y-2">
            {members
              .filter((m) => formData.AssignedForIds.includes(m.UserId))
              .map((m) => (
                <div
                  key={m.UserId}
                  className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-md"
                >
                  <p className="text-gray-700">{m.FullName}</p>
                  <button
                    data-id={m.UserId}
                    onClick={(e) => RemoveMember(e, formData, setFormData)}
                    className="text-red-500 text-xl font-bold hover:text-red-700"
                    aria-label="Remove member"
                  >
                    &times;
                  </button>
                </div>
              ))}
          </div>
        )}
      </form>
    </div>
  );
}
