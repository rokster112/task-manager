import { Link } from "react-router-dom";
import { PriorityEnum, StatusEnum } from "../../pages/Projects";
import { PriorityColor, StatusColor } from "../../utils/AssignColors";

export default function DashboardProjectList({ projects, currentSlide }) {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex w-full py-2 items-center justify-start overflow-x-hidden">
        {projects.map((p, i) => (
          <div
            key={i}
            className="w-[calc(100%/3)] lg:w-[calc(100%/4)] shrink-0 px-1 transition-all duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            <Link to={`/projects/${p.Id}`}>
              <div className="h-30 bg-[#fafbff] border-4 border-blue-200 shadow-xl rounded-md flex flex-col justify-center items-center hover:bg-green-50 hover:scale-105">
                <h3 className="text-center text-sm xs:text-base font-bold w-full">
                  {p.Title}
                </h3>
                <p
                  className="hidden xs:inline"
                  style={{ color: StatusColor(StatusEnum[p.Status]) }}
                >
                  {StatusEnum[p.Status]}
                </p>
                <p
                  className="hidden sm:inline"
                  style={{ color: PriorityColor(PriorityEnum[p.Priority]) }}
                >
                  {PriorityEnum[p.Priority]}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
