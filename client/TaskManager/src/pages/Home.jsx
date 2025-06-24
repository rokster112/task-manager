import { Link } from "react-router-dom";
import NoAuthHome from "../components/NoAuthHome";
import AuthHome from "../components/AuthHome";

export default function Home() {
  const tok = localStorage.getItem("authToken");

  return (
    <div className="h-[calc(100vh-88px)] flex flex-col items-center justify-start pt-[5vh] xs:pt-[10vh]">
      {tok ? <AuthHome /> : <NoAuthHome />}
    </div>
  );
}
