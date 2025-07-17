import { useState } from "react";
import ProjectForm from "../components/ProjectForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TransformDate } from "../utils/TransformDate";
const API = import.meta.env.VITE_API;

export default function UpdateProject({ project, id, token }) {
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const [formData, setFormData] = useState({
    Title: project.Title,
    StartDate: project.StartDate.slice(0, 16),
    EndDate: project.EndDate.slice(0, 16),
    Description: project.Description,
    Priority: project.Priority,
    ClientName: project.ClientName,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.patch(`${API}/projects/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response =>", response);
      navigate(`/projects/${id}`, { replace: true });
    } catch (error) {
      console.error("Error =>", error);
      setErr(error);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name == "Priority" ? Number(value) : value,
    }));
  }

  return (
    <ProjectForm
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      err={err}
      submitLabel="Update Project"
    />
  );
}
