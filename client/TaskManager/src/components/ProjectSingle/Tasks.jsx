import axios from "axios";
import { useEffect, useState } from "react";
import TaskCreate from "./Tasks/TaskCreate";
import TaskList from "./Tasks/TaskList";
import { safeApiCall } from "../../services/DashboardService";
import { fetchTasks } from "../../services/TaskService";

const API = import.meta.env.VITE_API;

export default function Tasks({ id, token, headOfProject, currentUser }) {
  const [err, setErr] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [toggleCreate, setToggleCreate] = useState(false);

  async function fetchTaskData() {
    const { data, error } = await safeApiCall(() => fetchTasks(id));
    if (error) return setErr(error);
    setTasks(data ?? []);
  }

  const taskList = tasks.map((t) => (
    <TaskList
      key={t.TaskId}
      task={t}
      headOfProject={headOfProject}
      currentUser={currentUser}
    />
  ));

  useEffect(() => {
    fetchTaskData();
  }, []);

  return (
    <div className="bg-[#feffff] h-fit rounded-xl p-2 m-2 md:p-6 md:m-6 shadow-xl">
      <p className="border-b-1 border-gray-200 text-gray-500 mb-2 pb-2 md:text-xl">
        Tasks
      </p>
      {headOfProject === currentUser && (
        <button
          className={`bg-custom-blue cursor-pointer text-white font-bold hover:bg-blue-700 transition duration-400 ease-in-out ${
            !toggleCreate ? "w-20 h-8" : "w-8"
          } rounded-md`}
          onClick={() => setToggleCreate((prev) => !prev)}
        >
          {toggleCreate ? "×" : "+ Add"}
        </button>
      )}
      {toggleCreate ? (
        <TaskCreate
          fetchTaskData={fetchTaskData}
          setToggleCreate={setToggleCreate}
          id={id}
          token={token}
          toggleCreate={toggleCreate}
        />
      ) : (
        <div className="overflow-scroll max-h-[350px]">{taskList}</div>
      )}
    </div>
  );
}
