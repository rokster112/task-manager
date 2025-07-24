import { useUser } from "../context/UserContext";
import {
  fetchUserProjects,
  fetchUserTasks,
  safeApiCall,
} from "../services/DashboardService";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardTaskList from "../components/Dashboard/DashboardTaskList";
import DashboardCarousel from "../components/Dashboard/DashboardCarousel";
import DashboardCalendar from "../components/Dashboard/DashboardCalendar";

export default function Dashboard({ theme }) {
  const [searchParams, setSearchParams] = useSearchParams({
    projectQuery: "",
    taskQuery: "",
  });
  const [err, setErr] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useUser();

  async function fetchProjectData() {
    const { data, error } = await safeApiCall(() =>
      fetchUserProjects(searchParams.get("projectQuery"))
    );
    if (error) return setErr(error);
    setProjects(data ?? []);
    setCurrentSlide(0);
  }

  async function fetchTasksData() {
    const { data, error } = await safeApiCall(() =>
      fetchUserTasks(searchParams.get("taskQuery"))
    );
    if (error) return setErr(error);
    setTasks(data ?? []);
  }

  useEffect(() => {
    fetchProjectData();
    fetchTasksData();
  }, [searchParams]);

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden flex flex-col">
      <h1 className="ml-[3%] mb-6 text-4xl font-semibold">
        Welcome{user ? `, ${user.FullName.split(" ")[0]}` : " back"}!
      </h1>
      <div className="">
        <div className="w-full max-w-[100vw] self-center">
          <DashboardCarousel
            projects={projects}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            theme={theme}
          />
        </div>
        <div className="flex flex-col ml-[3%] sm:ml-0 sm:flex-row justify-evenly mt-6 pb-4 md:justify-evenly lg:justify-between w-full">
          <div className="flex flex-col lg:ml-[3%] w-full xs:w-4/5 sm:w-9/20 md:w-1/2">
            <DashboardTaskList
              tasks={tasks}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </div>
          <DashboardCalendar />
        </div>
      </div>
    </div>
  );
}
