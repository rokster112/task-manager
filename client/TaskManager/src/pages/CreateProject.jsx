import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API;

export default function CreateProject() {
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const [formData, setFormData] = useState({
    Title: "",
    StartDate: null,
    EndDate: null,
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
    <div>
      <h1>Add Project</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          name="Title"
          type="text"
          value={formData.Title}
          placeholder="Project Title"
          onChange={(e) => handleChange(e)}
          className="flex border-1 rounded-sm border-red-500"
        />
        <label>
          Start Date
          <input
            name="StartDate"
            type="date"
            value={formData.StartDate}
            onChange={(e) => handleChange(e)}
            className="flex border-1 rounded-sm border-red-500"
          />
        </label>
        <label>
          <input
            name="EndDate"
            type="date"
            value={formData.EndDate}
            onChange={(e) => handleChange(e)}
            className="flex border-1 rounded-sm border-red-500"
          />
        </label>
        <textarea
          name="Description"
          type="text"
          value={formData.Description}
          placeholder="Project Description"
          onChange={(e) => handleChange(e)}
          className="flex border-1 rounded-sm border-red-500"
        ></textarea>
        <input
          name="ClientName"
          type="text"
          value={formData.ClientName}
          placeholder="Name of the client"
          onChange={(e) => handleChange(e)}
          className="flex border-1 rounded-sm border-red-500"
        />
        <select
          required
          onChange={(e) => handleChange(e)}
          value={formData.Priority}
          name="Priority"
        >
          <option className="select-option" value={0} disabled>
            --Please select a type--
          </option>
          <option value={1}>Low</option>
          <option value={2}>Medium</option>
          <option value={3}>High</option>
          <option value={4}>Urgent</option>
        </select>
        {err ? <h1>{err.response.data}</h1> : null}
        <button
          className="bg-rose-500 rounded-md p-2 cursor-pointer"
          type="submit"
        >
          Add Project
        </button>
      </form>
    </div>
  );
}
