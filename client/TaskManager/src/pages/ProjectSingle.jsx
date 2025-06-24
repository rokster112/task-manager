import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/ProjectSingle/Header";
import DetailsGrid from "../components/ProjectSingle/DetailsGrid";
import Members from "../components/ProjectSingle/Members";
import Tasks from "../components/ProjectSingle/Tasks";
import DeleteModal from "../components/ProjectSingle/DeleteModal";
import { jwtDecode } from "jwt-decode";
import UpdateProject from "./UpdateProject";
import { ArrowLeft } from "lucide-react";
const API = import.meta.env.VITE_API;

export default function ProjectSingle() {
  const [toggleMessage, setToggleMessage] = useState(false);
  const [project, setProject] = useState(null);
  const [updatedStatusMessage, setUpdatedStatusMessage] = useState(false);
  const [statusAndPriority, setStatusAndPriority] = useState({
    Status: "",
    Priority: "",
  });
  const { id } = useParams();
  const token = localStorage.getItem("authToken");
  const decoded = jwtDecode(token);
  const navigate = useNavigate();
  const location = useLocation();
  const updatePath = location.pathname.split("/").at(-1);
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
  }, [updatePath]);

  return updatePath !== "update-project" && project ? (
    <div className="min-h-[calc(100vh-88px)] h-full flex flex-col m-3 mb-0 xs:mb-0 pb-8 xs:m-8 ">
      <div
        className={`${
          toggleMessage ? "opacity-15" : "opacity-100"
        } flex flex-col bg-[#fafbff] rounded-lg xl:w-[1280px] xl:m-auto`}
      >
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 px-4 py-2 w-16 cursor-pointer text-gray-500 transition duration-400 ease-in-out hover:text-black"
        >
          <ArrowLeft size={32} />
        </button>
        <Header
          setToggleMessage={setToggleMessage}
          title={project.Title}
          headOfProject={project.HeadOfProject.UserId}
          currentUser={decoded.UserId}
          updatedStatusMessage={updatedStatusMessage}
          statusAndPriority={statusAndPriority}
          id={id}
        />
        <div className="md:grid md:grid-cols-2">
          <DetailsGrid
            project={project}
            setStatusAndPriority={setStatusAndPriority}
            statusAndPriority={statusAndPriority}
            token={token}
            id={id}
            setProject={setProject}
            setUpdatedStatusMessage={setUpdatedStatusMessage}
            currentUser={decoded.UserId}
          />
          <Members
            project={project}
            id={id}
            token={token}
            fetchProjectData={fetchData}
            currentUser={decoded.UserId}
          />
          <div className="bg-[#feffff] rounded-xl p-2 m-2 md:p-6 md:m-6 shadow-xl">
            <p className="border-b-1 border-gray-200 text-gray-500 mb-2 pb-2 md:text-xl">
              Description
            </p>
            <p>{project.Description}</p>
          </div>
          <Tasks />
        </div>
      </div>
      <DeleteModal
        setToggleMessage={setToggleMessage}
        toggleMessage={toggleMessage}
        handleDelete={handleDelete}
      />
    </div>
  ) : (
    project && (
      <UpdateProject
        project={project}
        id={id}
        token={token}
        fetchData={fetchData}
      />
    )
  );
}
