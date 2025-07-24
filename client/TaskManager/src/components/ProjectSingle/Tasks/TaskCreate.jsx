import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import { safeApiCall } from "../../../services/DashboardService";
import { postTask } from "../../../services/TaskService";

const API = import.meta.env.VITE_API;

export default function TaskCreate({
  fetchTaskData,
  id,
  token,
  setToggleCreate,
  toggleCreate,
}) {
  const [toggleMembers, setToggleMembers] = useState(false);
  const [err, setErr] = useState(false);
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    Title: "",
    AssignedForIds: [],
    Description: "",
    DueBy: "",
    Priority: 0,
    Status: 0,
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const { data, error } = await safeApiCall(() => postTask(id, formData));
    if (error) return setErr(error);

    setFormData({
      Title: "",
      AssignedForIds: [],
      Description: "",
      DueBy: "",
      Priority: 0,
      Status: 0,
    });
    setToggleCreate(false);
  }

  useEffect(() => {
    fetchTaskData(id);
  }, [toggleCreate]);

  return (
    <TaskForm
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
      submitLabel="Create Task"
      token={token}
      id={id}
      setErr={setErr}
      err={err}
      members={members}
      setMembers={setMembers}
      fetchTaskData={fetchTaskData}
      toggleMembers={toggleMembers}
      setToggleMembers={setToggleMembers}
      taskId={null}
    />
  );
}
