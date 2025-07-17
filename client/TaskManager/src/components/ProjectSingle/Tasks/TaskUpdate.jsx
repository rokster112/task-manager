import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import { useNavigate, useOutletContext } from "react-router-dom";
const API = import.meta.env.VITE_API;

export default function TaskUpdate() {
  const navigate = useNavigate();
  const { task, taskId, id, token, headOfProject, fetchTask } =
    useOutletContext();
  const [formData, setFormData] = useState({
    Title: task?.Title || "",
    AssignedForIds: task?.AssignedForIds || [],
    Description: task?.Description || "",
    DueBy: task?.DueBy ? task.DueBy.slice(0, 10) : "",
    Priority: task?.Priority ?? 0,
    Status: task?.Status ?? 0,
  });

  const [err, setErr] = useState(null);
  const [members, setMembers] = useState([]);
  const [toggleMembers, setToggleMembers] = useState(false);

  async function handleUpdateTask(e) {
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

  return (
    <TaskForm
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleUpdateTask}
      submitLabel="Update Task"
      token={token}
      id={id}
      setErr={setErr}
      err={err}
      members={members}
      setMembers={setMembers}
      toggleMembers={toggleMembers}
      setToggleMembers={setToggleMembers}
      taskId={taskId}
    />
  );
}
