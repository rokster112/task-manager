import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
const API = import.meta.env.VITE_API;

export default function CreateProject() {
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const [formData, setFormData] = useState({
    Title: "",
    StartDate: "",
    EndDate: "",
    Description: "",
    Priority: 0,
    ClientName: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name == "Priority" ? Number(value) : value,
    }));
    setErr(false);
  }

  const token = localStorage.getItem("authToken");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (formData.Priority < 1 || formData.Priority > 4) {
        setErr({ response: { data: "Please select Priority" } });
        return;
      }
      const response = await axios.post(`${API}/projects`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/projects/${response.data.Id}`, { replace: true });
    } catch (error) {
      setErr(error);
    }
  }

  return (
    <ProjectForm
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      err={err}
      submitLabel="Add Project"
    />
  );
}
