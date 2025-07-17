import { DashboardSelectChange } from "../../utils/DashboardSelectChange";

export default function DashboardTaskSelect({ searchParams, setSearchParams }) {
  const queryOptions = [
    { name: "In Progress", value: "" },
    { name: "Overdue Tasks", value: "overdue-user-tasks" },
    { name: "Upcoming Tasks", value: "upcoming-user-tasks" },
    { name: "Due in Seven Days", value: "due-in-seven-days" },
    { name: "Due Today", value: "tasks-due-today" },
  ];

  return (
    <div>
      <h1 className=" mb-4 text-2xl">Tasks Assigned to You</h1>
      <div className="flex flex-row bg-white w-fit py-1 px-2  sm:p-2 rounded-2xl border-blue-500 hover:border-1">
        <p className="hidden pr-1 xs:inline text-gray-400 text-sm sm:text-md font-semibold">
          Filter By
        </p>
        <select
          onChange={(e) =>
            DashboardSelectChange(e, setSearchParams, "taskQuery")
          }
          value={searchParams.get("taskQuery") || ""}
          name="taskQuery"
          className="text-sm cursor-pointer"
        >
          {queryOptions.map((q, i) => (
            <option
              className="text-start xs:text-end pl-6"
              key={i}
              value={q.value}
            >
              {q.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
