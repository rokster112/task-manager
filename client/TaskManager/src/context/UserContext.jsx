import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API;

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  async function fetchUserInfo() {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    try {
      const response = await axios.get(`${API}/home/user-info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response?.data ?? {});
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchUserInfo();
  }, [navigate]);

  return (
    <UserContext.Provider
      value={{ user, setUser, refetchUserInfo: fetchUserInfo }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  return context;
};
