// import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import ProjectSingle from "./pages/ProjectSingle";
import Authorization from "./components/Authorization";
import Navbar from "./components/Navbar";
import CreateProject from "./pages/CreateProject";
import UpdateProject from "./pages/UpdateProject";
import Tasks from "./components/ProjectSingle/Tasks";
import TaskSingle from "./components/ProjectSingle/Tasks/TaskSingle";
import TaskUpdate from "./components/ProjectSingle/Tasks/TaskUpdate";
import UserInfo from "./pages/UserInfo";
import { useEffect, useState } from "react";

export default function App() {
  const [theme, setTheme] = useState();

  useEffect(() => {
    const storageTheme = localStorage.getItem("theme");
    console.log(storageTheme);
    const themeExists = storageTheme === null ? "to-blue-200" : storageTheme;
    setTheme(themeExists);
  }, []);
  return (
    <div className={`bg-gradient-to-br from-white ${theme}`}>
      <Navbar theme={theme} />
      <Routes>
        <Route path="/" element={<Home setTheme={setTheme} theme={theme} />} />
        <Route element={<Authorization />}>
          <Route path="/register" element={<Register theme={theme} />} />
          <Route path="/login" element={<Login theme={theme} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectSingle />}>
            <Route path="update-project" element={<UpdateProject />} />
            <Route path="tasks" element={<Tasks />} />
          </Route>
          <Route path="/projects/:id/tasks/:taskId" element={<TaskSingle />}>
            <Route path="update" element={<TaskUpdate />} />
          </Route>
          <Route path="/create-project" element={<CreateProject />} />
        </Route>
        <Route path="/user-info" element={<UserInfo />} />
      </Routes>
    </div>
  );
}
