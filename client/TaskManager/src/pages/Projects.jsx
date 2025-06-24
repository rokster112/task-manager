import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import StatusBar from "../components/StatusBar";
const API = import.meta.env.VITE_API;

export const StatusEnum = {
  1: "In Progress",
  2: "On Hold",
  3: "Completed",
  4: "Cancelled",
  5: "Created",
};

export const PriorityEnum = {
  1: "Low",
  2: "Medium",
  3: "High",
  4: "Urgent",
};

export default function Projects() {
  const [err, setErr] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const token = localStorage.getItem("authToken");

  async function fetchData() {
    try {
      const response = await axios.get(`${API}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(response?.data ?? []);
      setErr(false);
    } catch (error) {
      setErr("Failed to fetch Projects");
    }
  }

  function handleSelectStatus(e) {
    const curVal = e.currentTarget.dataset.value;
    const statusVal = Object.entries(StatusEnum).find(
      ([key, value]) => value === curVal
    );
    setSelectedStatus(statusVal ? Number(statusVal[0]) : 0);
  }

  const filteredProjects = useMemo(() => {
    if (!selectedStatus) return projects;
    return projects.filter((p) => p.Status === selectedStatus);
  }, [selectedStatus, projects]);

  useEffect(() => {
    fetchData();
  }, []);

  // function handleSort(e) {
  //   const f = filteredProjects.sort((a, b) => )
  //! if i decide to implement this, i might need to convert const filteredProjects
  //! to let filteredProjects so i can reasign it after this function runs
  // }

  const mappedProjects = filteredProjects.map((item) => (
    <ProjectCard key={item.Id} project={item} />
  ));

  return (
    <div className="min-h-[calc(100vh-88px)] h-full">
      <div className="mr-2 sm:mr-4">
        <Link
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md inline-block relative left-[100%] transform -translate-x-full"
          to={"/create-project"}
        >
          + Add project
        </Link>
      </div>
      <h1 className="text-center mt-8 text-4xl xs:text-5xl font-bold">
        Project overview
      </h1>
      {err ? (
        <h1 className="h-[calc(100vh-274px)] flex flex-col text-2xl sm:text-4xl text-center mt-16">
          {err}
        </h1>
      ) : projects.length === 0 ? (
        <h1 className="h-[calc(100vh-274px)] flex flex-col text-2xl sm:text-4xl text-center mt-16">
          You do not have any projects yet
        </h1>
      ) : (
        <>
          <div className="flex flex-row items-center justify-center xs:gap-2 lg:gap-4 xl:gap-8 mt-8">
            <StatusBar
              projects={projects}
              handleSelectStatus={(e) => handleSelectStatus(e)}
              selectedStatus={selectedStatus}
            />
          </div>
          <div className="mx-2 py-12 flex flex-col items-center justify-center">
            <div className="w-full max-w-[1280px] px-4">
              {filteredProjects.length === 0 ? (
                <h1 className="text-2xl sm:text-4xl">No Projects to display</h1>
              ) : (
                <>
                  <div className="flex justify-between items-center mt-8 w-full">
                    <h1 className="text-3xl font-semibold">Projects</h1>
                    <div className="w-48 xs:w-60 bg-white py-2 rounded-4xl flex justify-between">
                      <p className="pl-2 xs:pl-4 text-gray-400">Sort By</p>
                      <select className="mr-2 pr-1 xs:pr-2 hover:cursor-pointer text-gray-500 font-semibold">
                        <option>Due date</option>
                        <option>Status</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-10 md:gap-12 lg:gap-5 xl:gap-12 mt-8 mx-auto max-w-full">
                      {mappedProjects}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
