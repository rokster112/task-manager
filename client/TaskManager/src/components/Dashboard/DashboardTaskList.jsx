import { Link } from "react-router-dom";
import { StatusEnum } from "../../pages/Projects";
import { hoverBackgroundColors, StatusColor } from "../../utils/AssignColors";
import DashboardTaskSelect from "./DashboardTaskSelect";

export default function DashboardTaskList({
  tasks,
  searchParams,
  setSearchParams,
}) {
  return (
    <>
      <DashboardTaskSelect
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <div className="max-h-[350px] max-w-[320px] xs:max-w-[400px] overflow-y-scroll overflow-x-hidden">
        {tasks.length > 0 ? (
          tasks.map((t) => (
            <Link
              to={`projects/${t.ProjectId}/tasks/${t.TaskId}`}
              key={t.TaskId}
            >
              <div
                className={`bg-white transition w-full rounded-md border-1 border-transparent duration-400 my-2 ease-in-out p-2 hover:border-blue-500 ${
                  hoverBackgroundColors[t.Status]
                }`}
              >
                <ul className="list-disc px-2">
                  <li
                    style={{
                      color: StatusColor(StatusEnum[t.Status]),
                      listStyle: "disc",
                    }}
                  >
                    <span className="overflow-x-hidden text-nowrap text-black">
                      {t.Title}
                    </span>
                  </li>
                </ul>
                <p className="overflow-x-hidden px-2 text-nowrap">
                  {t.Description}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-lg py-2 px-2 h-fit w-fit">
            Your task list is empty
          </p>
        )}
      </div>
    </>
  );
}
