import { DashboardSelectChange } from "../../utils/DashboardSelectChange";

export default function DashboardProjectsSelect({
  searchParams,
  setSearchParams,
}) {
  const queryOptions = [
    { name: "In Progress", value: "" },
    { name: "Upcoming", value: "upcoming" },
    { name: "Most Recent", value: "most-recent" },
    { name: "Overdue", value: "overdue" },
    { name: "Due in seven days", value: "due-in-seven-days" },
    { name: "Due today", value: "due-today" },
    { name: "High priority", value: "high-priority" },
  ];

  return (
    <div className="flex flex-col">
      <h1 className="ml-[3%] mb-4 text-2xl">Your Active Projects</h1>
      <div className="flex flex-row ml-[3%] bg-white w-fit py-1 px-2  sm:p-2 rounded-2xl border-blue-500 hover:border-1">
        <p className="hidden pr-1 xs:inline text-gray-400 text-sm sm:text-md font-semibold">
          Filter By
        </p>
        <select
          onChange={(e) =>
            DashboardSelectChange(e, setSearchParams, "projectQuery")
          }
          name="projectQuery"
          value={searchParams.get("projectQuery") || ""}
          className="w-fit cursor-pointer text-sm"
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
