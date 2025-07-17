import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ArrowLeft } from "lucide-react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { PriorityEnum, StatusEnum } from "../../../pages/Projects";
import { PriorityColor, StatusColor } from "../../../utils/AssignColors";
import { TransformDate } from "../../../utils/TransformDate";
const API = import.meta.env.VITE_API;

export default function TaskSingle({}) {
  const [err, setErr] = useState(null);
  const [task, setTask] = useState(null);
  const [headOfProject, setHeadOfProject] = useState(null);
  const { taskId, id } = useParams();
  //! I will use this to allow updating task title, due date etc only by head of project
  //! but being able to change task to complete, cancelled, in progress etc all members part of task can.
  const token = localStorage.getItem("authToken");
  const decoded = jwtDecode(token);
  const location = useLocation();
  const navigate = useNavigate();
  const pathName = location.pathname.split("/").at(-1);
  const canCompleteTask =
    task?.AssignedForIds.includes(decoded.UserId) ||
    headOfProject === decoded.UserId;
  //! I need to display members assigned to the task!!!!
  async function fetchTask() {
    try {
      const response = await axios.get(
        `${API}/projects/${id}/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTask(response?.data ?? {});
    } catch (error) {
      setErr(error);
    }
  }
  useEffect(() => {
    fetchTask();
    if (location.state) {
      setHeadOfProject(location.state.headOfProject);
    } else {
      async function fetchHeadOfProject() {
        const response = await axios.get(`${API}/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHeadOfProject(response.data.HeadOfProject.UserId);
      }
      fetchHeadOfProject();
    }
  }, [location.pathname]);

  async function handleDelete() {
    try {
      const response = await axios.delete(
        `${API}/projects/${id}/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(-1, { replace: true });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdateTask(e, formData, setErr) {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${API}/projects/${id}/tasks/${taskId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(`/projects/${id}/tasks/${taskId}`, { replace: true });
      fetchTask();
    } catch (error) {
      console.error(error);
      setErr(error);
    }
  }
  const priorityColor = PriorityColor(PriorityEnum[task?.Priority]);
  const statusColor = StatusColor(StatusEnum[task?.Status]);

  return (
    <div className="min-h-[calc(100vh-88px)] h-full">
      {pathName !== "update" ? (
        <div className="bg-[#feffff] rounded-xl p-2 m-2 md:p-6 md:m-6 shadow-xl ">
          <button
            onClick={() => navigate(`/projects/${id}`)}
            className="flex items-center gap-2 px-4 py-2 w-16 cursor-pointer text-gray-500 transition duration-400 ease-in-out hover:text-black"
          >
            <ArrowLeft size={32} />
          </button>
          {headOfProject === decoded.UserId && (
            <div className="flex flex-row">
              <Link
                className="flex justify-center items-center w-16 h-6 p-4 bg-red-200 rounded-md"
                to={"update"}
              >
                Update
              </Link>
              <button
                className="flex justify-center items-center w-16 h-6 p-4 bg-red-200 rounded-md cursor-pointer"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
          {task && canCompleteTask && task.Status !== 3 && (
            <button
              onClick={(e) => handleUpdateTask(e, { Status: 3 }, setErr)}
              className="w-auto flex flex-row transition-all"
            >
              <span className="peer flex h-8 w-8  text-green-600 text-xl font-bold rounded-[50%] bg-gray-100 items-center justify-center cursor-pointer">
                &#10003;
              </span>
              <span className="p-2 rounded-md border-1 border-black opacity-0 transition-all duration-400 ease-in-out peer-hover:opacity-100">
                Mark as Completed
              </span>
            </button>
          )}
          <div>
            <h1>{task?.Title}</h1>
            <p>
              Completed At:{" "}
              {task?.CompletedAt
                ? TransformDate(task?.CompletedAt)
                : "Not completed yet"}
            </p>
            <p>Created At: {TransformDate(task?.CreatedAt)}</p>
            <p>Description: {task?.Description}</p>
            <p>Due By: {TransformDate(task?.DueBy)}</p>
            <p>
              Priority:{" "}
              <span className="font-bold" style={{ color: priorityColor }}>
                {PriorityEnum[task?.Priority]}
              </span>
            </p>
            <p>
              Status:{" "}
              <span className="font-bold" style={{ color: statusColor }}>
                {StatusEnum[task?.Status]}
              </span>
            </p>
          </div>
        </div>
      ) : (
        <Outlet
          context={{ task, taskId, id, token, headOfProject, fetchTask }}
        />
      )}
    </div>
  );
}
