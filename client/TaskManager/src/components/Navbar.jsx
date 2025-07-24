import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import Avatar from "./ProjectSingle/Avatar";
import { useUser } from "../context/UserContext";

export default function Navbar({ theme, setTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const { user } = useUser();

  function logout() {
    setTimeout(() => {
      localStorage.clear();
      setToken(null);
      setTheme("to-blue-200");

      if (location.pathname !== "/") {
        navigate("/", { replace: true });
      }

      window.location.reload();
    }, 50);
  }

  useEffect(() => {
    setToken(localStorage.getItem("authToken"));
  }, [token, location.pathname]);

  return (
    <div className="h-22 flex flex-row justify-between bg-transparent ">
      <div className="z-1 flex flex-row justify-center items-center ml-2 sm:ml-4">
        <Link
          to={"/"}
          className="h-11 w-11 mr-2 rounded-md sm:ml-4 flex items-center justify-center bg-gradient-to-br from-custom-purple to-custom-blue"
        >
          <img src={Logo} className="w-8 h-8" />
        </Link>
        <p className="font-bold text-md sm:text-lg">Task Manager</p>
      </div>
      <div className="z-1 flex flex-row items-center justify-center mr-2 sm:mr-4">
        <ul>
          {token ? (
            <div className="flex flex-row justify-center items-center">
              <Link
                to={"/projects"}
                className="relative group h-11 w-18 xs:w-22 p-[3px] xs:p-[6px] mr-2 sm:mr-4 sm:p-[10px] bg-white rounded-md text-black font-bold flex flex-row items-center text-center justify-evenly "
              >
                <span className="absolute w-0 h-full rounded-sm top-0 bg-custom-purple transition-all duration-400 ease-in-out group-hover:w-full"></span>
                <span className="text-sm xs:text-base relative z-2 transition-colors duration-400 ease-in-out group-hover:text-white">
                  Projects
                </span>
              </Link>
              <Link
                onClick={logout}
                className="h-11 w-fit text-sm xs:text-base p-[3px] xs:p-[6px] sm:p-[10px] rounded-md text-white font-bold bg-black flex flex-row items-center text-center justify-center transition duration-400 ease-in-out hover:bg-red-600"
              >
                Log Out
              </Link>
              {user && (
                <Link
                  to={"/user-info"}
                  className="ml-2 sm:ml-4 transition duration-400 ease-in-out hover:scale-125"
                >
                  <Avatar
                    avatarUrl={user.AvatarUrl}
                    name={user.FullName}
                    height={"h-12"}
                    width={"w-12"}
                    minHeight={"h-12"}
                    minWidth={"w-12"}
                  />
                </Link>
              )}
            </div>
          ) : (
            <>
              <Link
                to={"/register"}
                className="relative group h-11 w-18 p-[6px] mr-2 sm:mr-4 text-sm sm:p-[12px] sm:text-md rounded-md text-white font-semibold bg-custom-blue"
              >
                <span className="absolute w-0 h-full top-0 right-0 bg-custom-purple rounded-sm transition-all duration-400 ease-in-out group-hover:w-full"></span>
                <span className="relative z-2">Get Started</span>
              </Link>
              <Link
                to={"/login"}
                className={`relative ${
                  theme === "to-black" && "bg-blue-50"
                } group h-11 w-12 p-[6px] text-sm sm:text-md sm:p-[12px] rounded-md border-1 border-black transition duration-400 ease-in-out hover:border-white`}
              >
                <span className="absolute  w-0 h-full rounded-sm bg-custom-blue top-0 left-0 transition-all duration-400 ease-in-out group-hover:w-full"></span>
                <span className="relative z-2 transition text-black font-semibold duration-400 ease-in-out group-hover:text-white">
                  Log In
                </span>
              </Link>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
