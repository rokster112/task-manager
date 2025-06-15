import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import UpdateProject from "../components/UpdateProject";
const API = import.meta.env.VITE_API;

export default function ProjectSingle() {
  const [toggleMessage, setToggleMessage] = useState(false);
  const [project, setProject] = useState(null);
  const [toggleUpdate, setToggleUpdate] = useState("visible");
  const { id } = useParams();
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  async function fetchData() {
    try {
      const response = await axios.get(`${API}/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProject(response.data);
    } catch (error) {}
  }

  async function handleDelete() {
    try {
      const response = await axios.delete(`${API}/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/projects", { replace: true });
    } catch (error) {
      console.error("Error =====>", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div className={`bg-rose-200 ${toggleUpdate}`}>
        <h1>Project single</h1>
        {!toggleMessage ? (
          <>
            <button
              className="bg-rose-500 rounded-md p-2"
              onClick={() => setToggleMessage(true)}
            >
              Delete
            </button>

            {project && (
              <>
                <h1>{project.Title}</h1>
                <div>
                  {project.Users.map((u) => (
                    <div key={u.UserId}>
                      <p>{u.FullName}</p>
                      <p>{u.Position}</p>
                      {/* Haven't used avatar yet */}
                    </div>
                  ))}
                </div>
                {/* This will be to display tasks */}
                {/* <div>{project.Tasks.map(t => <div><p>{t.Title}</p></div>)}</div> */}
                <p>Status: {project.Status}</p>
                <p>{project.StartDate}</p>
                <p>{project.EndDate}</p>
                <p>{project.CreatedAt}</p>
                <p>{project.Priority}</p>
                <p>{project.ClientName}</p>
                <p>{project.Description}</p>
                <div>
                  <p>{project.HeadOfProject.FullName}</p>
                  <p>{project.HeadOfProject.Position}</p>
                  {/* Haven't used avatar yet */}
                </div>
              </>
            )}
          </>
        ) : (
          <div>
            <h1>Are you sure you want to delete the project?</h1>
            <button onClick={handleDelete}>Yes</button>
            <button onClick={() => setToggleMessage(false)}>No</button>
          </div>
        )}
      </div>
      <button
        className="bg-emerald-300 rounded-md p-2"
        onClick={() =>
          setToggleUpdate((prev) =>
            prev === "invisible" ? "visible" : "invisible"
          )
        }
      >
        Toggle
      </button>
      <div className="bg-emerald-300">
        <UpdateProject />
      </div>
    </>
  );
}
