import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API;
import bg from "../assets/form-bg.png";

export default function Login() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [err, setErr] = useState(false);
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErr(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/auth/login`, formData);
      const token = response.data;
      localStorage.setItem("authToken", token);
      console.error(response);
      setIsActive(true);
      setTimeout(() => {
        navigate("/projects", { replace: true });
      }, 600);
    } catch (error) {
      console.error(error);
      setErr(error);
      setIsActive(false);
    }
  }
  return (
    <div
      className="h-screen w-full absolute top-0 bg-no-repeat bg-cover pt-[200px]"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="relative flex gap-2 flex-col justify-start rounded-xl items-center h-2/3 mx-auto w-[calc(100vw-40px)] xs:max-w-[400px] sm:max-w-[500px] bg-gradient-to-br from-white to-blue-50 bg-transparent shadow-xl"
        onSubmit={(e) => handleSubmit(e)}
      >
        <h1 className="text-5xl sm:text-6xl pt-16 font-semibold text-dark-blue">
          Login
        </h1>
        <p className="text-dark-blue text-xl pt-6">
          Please sign in to your account.
        </p>
        <input
          required
          name="Email"
          type="email"
          value={formData.Email}
          placeholder="example@email.com"
          onChange={(e) => handleChange(e)}
          className="border-1 border-gray-300 rounded-md bg-white h-10 w-[calc(100%-40px)] xs:max-w-[360px] mt-8 hover:border-gray-500 pl-2"
        />
        <input
          required
          name="Password"
          type="password"
          value={formData.Password}
          placeholder="Password"
          onChange={(e) => handleChange(e)}
          className="border-1 border-gray-300 rounded-md bg-white h-10 w-[calc(100%-40px)] xs:max-w-[360px] mt-4 hover:border-gray-500 pl-2 mb-2  xl:mb-6"
        />
        {err !== false ? (
          <h1 className="font-bold text-red-600">{err.response.data}</h1>
        ) : null}
        <button
          className="absolute bottom-4 w-2/3 h-12 cursor-pointer bg-custom-blue text-white transition duration-400 ease-in-out font-semibold rounded-md hover:bg-blue-700"
          type="submit"
          disabled={isActive}
        >
          <span
            className={`absolute bottom-0 text-5xl flex items-center justify-end rounded left-0 h-full bg-custom-purple transition-all duration-450 ease-in-out ${
              isActive ? "w-full" : "w-0"
            }`}
          >
            ❱
          </span>
          <span
            className={`relative z-1 delay-400 ${
              isActive ? "opacity-0" : "opacity-100"
            }`}
          >
            Sign In
          </span>
          <span
            className={`absolute z-1 border-2 font-semibold transition-all ease-in-out delay-400 border-white px-2 py-1 rounded-[50%] text-white ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            ✓
          </span>
        </button>
      </form>
    </div>
  );
}
