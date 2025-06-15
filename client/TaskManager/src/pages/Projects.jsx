import axios from "axios";
import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { Link } from "react-router-dom";
const API = import.meta.env.VITE_API;

export default function Projects() {
  const [err, setErr] = useState(false);
  const [projects, setProjects] = useState(null);

  const token = localStorage.getItem("authToken");

  const mappedProjects =
    projects &&
    projects.map((item) => <ProjectCard key={item.Id} project={item} />);

  async function fetchData() {
    try {
      const data = await axios.get(`${API}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(data.data);
    } catch (error) {
      setErr(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  // console.log(projects);
  return (
    <>
      <Link to={"/create-project"}>Add project</Link>
      {!projects && <h1>You do not have any projects yet</h1>}
      <div>{mappedProjects}</div>
    </>
  );
}
