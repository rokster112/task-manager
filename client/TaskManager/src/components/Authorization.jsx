import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Authorization() {
  const navigate = useNavigate();
  const location = useLocation();
  function isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch (error) {
      return true;
    }
  }
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("authToken");
      if (location.pathname !== "/register") {
        navigate("/login", { replace: true });
      }
    } else if (
      location.pathname === "/login" ||
      location.pathname === "/register"
    ) {
      navigate("/projects", { replace: true });
    }
  }, [navigate, location.pathname]);

  return (
    <>
      <Outlet />
    </>
  );
}
