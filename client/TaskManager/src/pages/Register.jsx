import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bg from "../assets/form-bg.png";
import darkBg from "../assets/Dark-theme-bg.png";
import { UserFormHandleChange } from "../utils/UserFormHandleChange";

const API = import.meta.env.VITE_API;

export default function Register({ theme }) {
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(false);
  const [err, setErr] = useState(false);
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
    FullName: "",
    Position: "",
    AvatarUrl: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await axios.post(`${API}/auth/register`, formData);
      setIsActive(true);
      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      setErr(error);
      setIsActive(false);
    }
  }

  return (
    <div
      className="h-screen w-full absolute top-0 bg-no-repeat bg-cover pt-[200px]"
      style={{
        backgroundImage: `url(${theme === "to-blue-200" ? bg : darkBg})`,
      }}
    >
      <form
        className={`relative flex gap-2 flex-col justify-start rounded-xl items-center h-[85%] xl:h-[75%] mx-auto w-[calc(100vw-40px)] xs:max-w-[400px] sm:max-w-[500px] bg-gradient-to-br from-transparent to-white ${
          theme === "to-black"
            ? "shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
            : "shadow-xl"
        }`}
        onSubmit={(e) => handleSubmit(e)}
      >
        <h1
          className={`text-5xl sm:text-6xl pt-4 font-semibold ${
            theme === "to-black" ? "text-light-blue" : "text-dark-blue"
          }`}
        >
          Register
        </h1>
        <p
          className={`${
            theme === "to-black" ? "text-light-blue" : "text-dark-blue"
          } text-xl pt-3`}
        >
          Start building your profile.
        </p>
        <input
          required
          name="Email"
          type="email"
          value={formData.Email}
          onChange={(e) => UserFormHandleChange(e, setFormData, setErr)}
          placeholder="example@email.com"
          className="border-1 border-gray-300 rounded-md bg-white h-10 w-[calc(100%-40px)] xs:max-w-[360px] mt-4 hover:border-gray-500 pl-2"
        />
        <input
          required
          name="Password"
          type="password"
          value={formData.Password}
          onChange={(e) => UserFormHandleChange(e, setFormData, setErr)}
          placeholder="Password"
          className="border-1 border-gray-300 rounded-md bg-white h-10 w-[calc(100%-40px)] xs:max-w-[360px] mt-4 hover:border-gray-500 pl-2"
        />
        <input
          required
          name="FullName"
          type="text"
          value={formData.FullName}
          onChange={(e) => UserFormHandleChange(e, setFormData, setErr)}
          placeholder="John Doe"
          className="border-1 border-gray-300 rounded-md bg-white h-10 w-[calc(100%-40px)] xs:max-w-[360px] mt-4 hover:border-gray-500 pl-2"
        />
        <input
          required
          name="Position"
          type="text"
          value={formData.Position}
          onChange={(e) => UserFormHandleChange(e, setFormData, setErr)}
          placeholder="JavaScript developer"
          className="border-1 border-gray-300 rounded-md bg-white h-10 w-[calc(100%-40px)] xs:max-w-[360px] mt-4 hover:border-gray-500 pl-2"
        />
        <input
          name="AvatarUrl"
          type="text"
          value={formData.AvatarUrl}
          onChange={(e) => UserFormHandleChange(e, setFormData, setErr)}
          placeholder="https://avatar-picture-user.png"
          className="border-1 border-gray-300 rounded-md bg-white h-10 w-[calc(100%-40px)] xs:max-w-[360px] mt-4 hover:border-gray-500 pl-2"
        />
        {err !== false ? (
          <h1 className="font-bold text-red-600">{err.response.data}</h1>
        ) : null}
        <button
          className="absolute flex justify-center items-center bottom-4 w-2/3 h-12 cursor-pointer bg-custom-blue text-white transition duration-400 ease-in-out font-semibold rounded-md hover:bg-blue-700"
          type="submit"
          disabled={isActive}
        >
          <span
            className={`absolute top-0 h-full bg-custom-purple rounded-md transition-all ease-in-out duration-800 ${
              isActive ? "w-full" : "w-0"
            }`}
          ></span>
          <span className="z-1">Sign Up</span>
        </button>
      </form>
    </div>
  );
}
