import { Link } from "react-router-dom";
import { PriorityEnum, StatusEnum } from "../pages/Projects";
import { PriorityColor, StatusColor } from "../utils/AssignColors";

export default function ProjectCard({ project }) {
  const indexOfT = project.StartDate.indexOf("T");
  const statusColor = StatusColor(StatusEnum[project.Status]);
  const priorityColor = PriorityColor(PriorityEnum[project.Priority]);
  return (
    <Link
      to={`/projects/${project.Id}`}
      className="bg-white rounded-md flex flex-col h-[300px] w-[300px] md:h-[340px] md:w-[340px] lg:w-[300px] shadow-2xl justify-between"
    >
      <div className="flex flex-row justify-between m-2">
        <p className="text-gray-400 font-semibold">
          Deadline: {project.EndDate.slice(0, indexOfT)}
        </p>
        <p className="font-bold" style={{ color: statusColor }}>
          {StatusEnum[project.Status].toUpperCase()}
        </p>
      </div>
      <h1 className="text-2xl font-bold m-2">{project.Title}</h1>
      <p className="text-gray-400 mx-2">
        Priority:{" "}
        <span className="font-bold" style={{ color: priorityColor }}>
          {PriorityEnum[project.Priority] &&
            PriorityEnum[project.Priority].toUpperCase()}
        </span>
      </p>
      <p className="h-[135px] overflow-hidden m-2">{project.Description}</p>
      <div className="flex flex-row justify-between m-2">
        <p>Start: {project.StartDate.slice(0, indexOfT)}</p>
        <p>{project.ClientName}</p>
      </div>
    </Link>
  );
}
