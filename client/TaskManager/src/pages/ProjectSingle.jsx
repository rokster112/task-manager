import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/ProjectSingle/Header";
import DetailsGrid from "../components/ProjectSingle/DetailsGrid";
import Members from "../components/ProjectSingle/Members";
import Tasks from "../components/ProjectSingle/Tasks";
import DeleteModal from "../components/ProjectSingle/DeleteModal";
import { jwtDecode } from "jwt-decode";
import UpdateProject from "./UpdateProject";
import { ArrowLeft } from "lucide-react";
import { safeApiCall } from "../services/DashboardService";
import {
  fetchProject,
  fetchProjectMembers,
} from "../services/ProjectSingleService";
import { ClipLoader } from "react-spinners";
const API = import.meta.env.VITE_API;
const override = {
  margin: "0 auto",
  display: "block",
  marginTop: "20px",
};

export default function ProjectSingle() {
  const [err, setErr] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(null);
  const [toggleMessage, setToggleMessage] = useState(false);
  const [project, setProject] = useState(null);
  const [updatedStatusMessage, setUpdatedStatusMessage] = useState(false);
  const [statusAndPriority, setStatusAndPriority] = useState({
    Status: "",
    Priority: "",
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const decoded = jwtDecode(token);
  const location = useLocation();
  const pathArr = location.pathname.split("/");
  const updatePath = pathArr.length <= 4 ? pathArr.at(-1) : id;

  async function fetchData() {
    try {
      setLoading(true);

      const [projectResult, projectMembersResult] = await Promise.all([
        safeApiCall(() => fetchProject(id)),
        safeApiCall(() => fetchProjectMembers(id)),
      ]);

      const { data: projectData, error: projectErr } = projectResult;
      const { data: memberData, error: memberErr } = projectMembersResult;

      if (projectErr || memberErr) {
        setErr(projectErr || memberErr);
        return;
      }

      setProject(projectData ?? []);
      setUsers(memberData ?? []);
    } catch (e) {
      setErr("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
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
    if (location.search) {
      setSearch(location.search.slice(1));
    }
  }, [updatePath]);

  if (loading) {
    return (
      <div className="h-screen">
        <ClipLoader
          loading={loading}
          color="#325bff"
          size={120}
          cssOverride={override}
        />
      </div>
    );
  }

  return updatePath !== "update-project" && project ? (
    <>
      <div className="min-h-[calc(100vh-88px)] h-full flex flex-col m-3 mb-0 xs:mb-0 pb-8 xs:m-8 ">
        <div
          className={`${
            toggleMessage ? "opacity-15" : "opacity-100"
          } flex flex-col bg-[#fafbff] rounded-lg xl:w-[1280px] xl:m-auto`}
        >
          <button
            onClick={() =>
              navigate(`/projects${search ? `?query=${search}` : ""}`)
            }
            className="flex items-center gap-2 m-[3%] px-4 py-2 text-gray-500 hover:text-black transition cursor-pointer"
          >
            <ArrowLeft size={24} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <Header
            setToggleMessage={setToggleMessage}
            title={project.Title}
            headOfProject={project.HeadOfProject}
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
              Users={users}
            />
            <div className="bg-[#feffff] h-fit rounded-xl p-2 m-2 md:p-6 md:m-6 shadow-xl">
              <p className="border-b-1 border-gray-200 text-gray-500 mb-2 pb-2 md:text-xl">
                Description
              </p>
              <p>{project.Description}</p>
            </div>
            <Tasks
              id={id}
              token={token}
              headOfProject={project.HeadOfProject}
              currentUser={decoded.UserId}
            />
          </div>
        </div>
        <DeleteModal
          setToggleMessage={setToggleMessage}
          toggleMessage={toggleMessage}
          handleDelete={handleDelete}
        />
      </div>
    </>
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
