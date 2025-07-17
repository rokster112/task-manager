import axios from "axios";
import { useEffect, useState } from "react";
import { PriorityEnum } from "../../../pages/Projects";
import { HandleChange } from "../../../utils/HandleChange";
import { RemoveMember } from "../../../utils/RemoveMember";
import { FetchMemberData } from "../../../utils/FetchMemberData";
import TaskForm from "./TaskForm";

const API = import.meta.env.VITE_API;

export default function TaskCreate({
  fetchTaskData,
  id,
  token,
  setToggleCreate,
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
    try {
      if (!formData.DueBy) {
        throw new Error("Please select due by date");
      }
      const response = await axios.post(
        `${API}/projects/${id}/tasks`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTaskData();
      setFormData({
        Title: "",
        AssignedForIds: [],
        Description: "",
        DueBy: "",
        Priority: 0,
        Status: 0,
      });
      setToggleCreate(false);
    } catch (error) {
      setErr(error);
    }
  }

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
