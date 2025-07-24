import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";

import Add from "../assets/add-home.png";
import Checklist from "../assets/checklist-home.png";
import Group from "../assets/group-home.png";
import Bell from "../assets/bell-home.png";
import { useUser } from "../context/UserContext";
import ThemeBtn from "../components/ThemeBtn";

export default function Home({ theme }) {
  const token = localStorage.getItem("authToken");

  const noAuthHomeJSX = (
    <div className="xs:pt-[5vh]">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-center mb-6">
        Welcome to Task Manager!
      </h1>
      <p
        className={`text-center ${
          theme === "to-blue-200" ? "text-gray-500" : "text-light-blue"
        }  font-medium mb-8`}
      >
        Manage your projects effortlessly and keep your team in sync.
      </p>
      <div className="mb-10 flex flex-row items-center justify-center">
        <Link
          to={"/register"}
          className="w-30 h-12 p-4 flex justify-center items-center rounded-md bg-custom-blue cursor-pointer mr-4 font-semibold text-white transition duration-400 ease-in-out hover:scale-115"
        >
          Get Started
        </Link>
        <Link
          to={"/login"}
          className="w-24 h-12 p-4 flex justify-center items-center rounded-md bg-white cursor-pointer font-semibold text-black transition duration-300 ease-in-out hover:scale-115"
        >
          Log In
        </Link>
      </div>
      <div className="grid grid-cols-2 pt-[5vh] xs:pt-[10vh] gap-4 mx-4 sm:mx-[10%] md:mx-[15%] lg:mx-[20%]">
        {[
          { icon: Add, desc: "Create and track projects with ease" },
          { icon: Checklist, desc: "Collaborate with your team in real-time" },
          { icon: Group, desc: "Assign tasks and monitor progress" },
          { icon: Bell, desc: "Stay organised and meet deadlines" },
        ].map((item, i) => (
          <div
            key={i}
            className="min-h-24 h-24 items-center justify-center py-2 xs:py-6 rounded-lg flex flex-row bg-custom-white transition duration-400 hover:scale-110"
          >
            <img
              className="rounded-[35%] w-[10%] p-[2px] mr-2 ml-2 hidden xs:block sm:mr-4 sm:ml-4 bg-custom-blue"
              src={item.icon}
              alt=""
            />
            <p className="w-90% flex-1 text-sm ml-2 xs:ml-0 sm:text-lg">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-88px)] flex flex-col items-center justify-start pt-[5vh]">
      {token ? <Dashboard theme={theme} /> : noAuthHomeJSX}
    </div>
  );
}
