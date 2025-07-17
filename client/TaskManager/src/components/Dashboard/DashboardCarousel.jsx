import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DashboardProjectList from "./DashboardProjectList";
import DashboardProjectsSelect from "./DashboardProjectsSelect";

export default function DashboardCarousel({
  projects,
  currentSlide,
  setCurrentSlide,
  searchParams,
  setSearchParams,
  theme,
}) {
  const [width, setWidth] = useState(window.innerWidth);

  function next() {
    const result = currentSlide + 1;
    if (
      currentSlide === projects.length - 3 ||
      (currentSlide === projects.length - 4 && width >= 1024)
    ) {
      setCurrentSlide(0);
      return;
    }
    setCurrentSlide(result);
  }

  function previous() {
    const result = currentSlide - 1;
    if (currentSlide === 0) {
      if (width >= 1024) {
        setCurrentSlide(projects.length - 4);
      } else {
        setCurrentSlide(projects.length - 3);
      }
      return;
    }
    setCurrentSlide(result);
  }

  useEffect(() => {
    function handleSize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleSize);
    return () => window.removeEventListener("resize", handleSize);
  }, []);
  const chevronVisibility =
    (width < 1024 && projects.length < 4) ||
    (width >= 1024 && projects.length < 5)
      ? "hidden"
      : "inline";
  return (
    <div className="flex flex-col">
      <DashboardProjectsSelect
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      {projects.length > 0 ? (
        <div className="w-full max-w-[100vw] min-w-[320px] flex flex-row items-center justify-between">
          <button
            className={`w-8 h-8 transition hover:scale-125 cursor-pointer ${chevronVisibility}`}
            onClick={previous}
          >
            <ChevronLeft
              className={`w-full h-full ${
                theme === "to-black" ? "text-blue-200" : "to-light-blue"
              }`}
            />
          </button>

          <DashboardProjectList
            projects={projects}
            currentSlide={currentSlide}
          />
          <button
            className={`w-8 h-8 transition hover:scale-125 cursor-pointer ${chevronVisibility}`}
            onClick={next}
          >
            <ChevronRight
              className={`w-full h-full ${
                theme === "to-black" ? "text-blue-200" : "to-light-blue"
              }`}
            />
          </button>
        </div>
      ) : (
        <h1 className="text-2xl ml-[3%] my-4">No projects to display</h1>
      )}
    </div>
  );
}
