import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ArrowLeft } from "lucide-react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { PriorityEnum, StatusEnum } from "../../../pages/Projects";
import { PriorityColor, StatusColor } from "../../../utils/AssignColors";
import { TransformDate } from "../../../utils/TransformDate";
import { safeApiCall } from "../../../services/DashboardService";
import {
  deleteTask,
  fetchHeadOfProject,
  fetchTask,
  fetchTaskMembers,
  updateTask,
} from "../../../services/TaskService";
import Comments from "../Comments/Comments";
const API = import.meta.env.VITE_API;

export default function TaskSingle({}) {
  const [err, setErr] = useState(null);
  const [task, setTask] = useState(null);
  const [headOfProject, setHeadOfProject] = useState(null);
  const [taskMembers, setTaskMembers] = useState([]);
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
  async function fetchTaskData() {
    const [taskResult, memberResult] = await Promise.all([
      safeApiCall(() => fetchTask(id, taskId)),
      safeApiCall(() => fetchTaskMembers(id, taskId)),
    ]);

    const { data: taskData, error: taskError } = taskResult;
    const { data: memberData, error: memberError } = memberResult;

    if (taskError || memberError) return setErr(taskError || memberError);

    setTask(taskData ?? {});
    setTaskMembers(memberData ?? []);
  }

  console.log(taskMembers);

  async function fetchHeadOfProjectData() {
    const { data, error } = await safeApiCall(() => fetchHeadOfProject(id));
    if (error) return setErr(error);

    setHeadOfProject(data?.HeadOfProject);
  }
  //! I dont think I need to check for state for Head of project, because now i have a dedicated request.
  //! First I need to remove from parent comp, then from here.
  useEffect(() => {
    fetchTaskData();
    if (location.state) {
      setHeadOfProject(location.state.headOfProject);
    } else {
      fetchHeadOfProjectData();
    }
  }, [location.pathname]);

  async function handleDelete() {
    const { data, error } = await safeApiCall(() => deleteTask(id, taskId));
    if (error) return setErr(error);

    navigate(`/projects/${id}`, { replace: true });
  }

  async function handleUpdateTask(e, formData, setErr) {
    e.preventDefault();
    const { data, error } = await safeApiCall(() =>
      updateTask(id, taskId, formData)
    );
    if (error) return setErr(error);

    navigate(`/projects/${id}/tasks/${taskId}`, { replace: true });
    fetchTaskData();
  }

  const priorityColor = PriorityColor(PriorityEnum[task?.Priority]);
  const statusColor = StatusColor(StatusEnum[task?.Status]);

  return (
    <div className="min-h-[calc(100vh-112px)] h-full pb-6">
      {pathName !== "update" ? (
        <>
          <div className="bg-[#feffff] rounded-xl p-4 m-2 md:p-8 md:m-6 shadow-xl space-y-6">
            {/* Top Controls */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate(`/projects/${id}`)}
                className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-black transition cursor-pointer"
              >
                <ArrowLeft size={24} />
                <span className="hidden sm:inline">Back</span>
              </button>

              {headOfProject === decoded.UserId && (
                <div className="flex gap-4">
                  <Link
                    to="update"
                    className="px-4 py-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 cursor-pointer"
                  >
                    Update
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Mark as Completed */}
            {task && canCompleteTask && task.Status !== 3 && (
              <button
                onClick={(e) => handleUpdateTask(e, { Status: 3 }, setErr)}
                className="w-fit inline-flex items-center gap-2"
              >
                <span className="peer flex h-8 w-8 text-green-600 text-xl font-bold rounded-full bg-gray-100 hover:bg-gray-200 hover:text-green-700 items-center justify-center cursor-pointer">
                  &#10003;
                </span>
                <span className="transition-opacity duration-300 ease-in-out opacity-0 peer-hover:opacity-100 px-3 py-1 border border-black rounded-md text-sm">
                  Mark as Completed
                </span>
              </button>
            )}

            {/* Task Details */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{task?.Title}</h1>
              <p className="text-gray-700">
                <span className="font-semibold">Completed At:</span>{" "}
                {task?.CompletedAt
                  ? TransformDate(task?.CompletedAt)
                  : "Not completed yet"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Created At:</span>{" "}
                {TransformDate(task?.CreatedAt)}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Description:</span>{" "}
                {task?.Description}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Due By:</span>{" "}
                {TransformDate(task?.DueBy)}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Priority:</span>{" "}
                <span className="font-bold" style={{ color: priorityColor }}>
                  {PriorityEnum[task?.Priority]}
                </span>
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Status:</span>{" "}
                <span className="font-bold" style={{ color: statusColor }}>
                  {StatusEnum[task?.Status]}
                </span>
              </p>
            </div>

            {/* Members */}
            <div>
              <p className="font-semibold mb-2">Members:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {taskMembers.map((m) => (
                  <div
                    key={m.UserId}
                    className="bg-gray-50 p-3 rounded-md shadow-sm"
                  >
                    <p className="font-medium">{m.FullName}</p>
                    <p className="text-sm text-gray-600">{m.Position}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comments */}
          <Comments
            currentUser={decoded.UserId}
            taskId={taskId}
            id={id}
            taskMembers={taskMembers}
          />
        </>
      ) : (
        <Outlet
          context={{ task, taskId, id, token, headOfProject, fetchTaskData }}
        />
      )}
    </div>
  );
}
