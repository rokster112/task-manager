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

export default function App() {
  return (
    <div className="bg-gradient-to-br from-white to-blue-200">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<Authorization />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectSingle />}>
            <Route path="update-project" element={<UpdateProject />} />
          </Route>
          <Route path="/create-project" element={<CreateProject />} />
        </Route>
      </Routes>
    </div>
  );
}
