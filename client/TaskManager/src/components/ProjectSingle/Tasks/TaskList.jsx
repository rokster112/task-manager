import { Link } from "react-router-dom";
import { StatusEnum } from "../../../pages/Projects";
import { StatusColor } from "../../../utils/AssignColors";

export default function TaskList({ task, headOfProject, currentUser }) {
  const statusColor = StatusColor(StatusEnum[task.Status]);

  return (
    <div className="transition rounded-md border-gray-300 duration-400 my-2 ease-in-out hover:bg-gray-50 p-2 hover:border-1">
      <Link to={`tasks/${task.TaskId}`} state={{ headOfProject }}>
        <ul className="list-disc pl-5">
          <li style={{ color: statusColor, listStyle: "disc" }}>
            <span className="text-black">{task.Title}</span>
          </li>
        </ul>
        <p>{task.Description}</p>
        <p
          className=" w-fit px-4 h-8 flex items-center justify-center rounded-4xl text-white font-bold"
          style={{ background: statusColor }}
        >
          {StatusEnum[task.Status]}
        </p>
      </Link>
    </div>
  );
}
