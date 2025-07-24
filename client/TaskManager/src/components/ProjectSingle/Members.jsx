import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Members/Header";
import ToggleButtonsRow from "./Members/ToggleButtonsRow";
import UsersTable from "./Members/UsersTable";
import SelectedMembers from "./Members/SelectedMembers";
import {
  fetchMembers,
  fetchProjectHead,
} from "../../services/ProjectSingleService";
import { safeApiCall } from "../../services/DashboardService";
const API = import.meta.env.VITE_API;

export default function Members({
  project,
  id,
  token,
  fetchProjectData,
  currentUser,
  Users,
}) {
  const { HeadOfProject } = project;
  const [members, setMembers] = useState([]);
  const [err, setErr] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState(null);
  const [headOfProjectObject, setHeadOfProjectObject] = useState([]);
  const [toggle, setToggle] = useState({
    showCurrent: false,
    showAvailable: false,
    showSelection: false,
  });

  async function fetchData() {
    const [membersResult, headResult] = await Promise.all([
      safeApiCall(() => fetchMembers(id)),
      safeApiCall(() => fetchProjectHead(id)),
    ]);
    const { data: membersData, error: membersErr } = membersResult;
    const { data: headData, error: headErr } = headResult;
    if (membersErr || headErr) return setErr(membersErr || headErr);

    setHeadOfProjectObject(headData ?? []);
    setMembers(membersData ?? []);
  }

  function resetData() {
    setSelectedMembers(null);
    fetchProjectData();
    fetchData();
    setToggle({
      showAvailable: false,
      showCurrent: false,
      showSelection: false,
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-[#feffff] rounded-xl p-2 m-2 md:p-6 md:m-6 shadow-xl relative">
      {Object.entries(headOfProjectObject).length > 0 && (
        <Header
          toggle={toggle}
          setToggle={setToggle}
          setSelectedMembers={setSelectedMembers}
          HeadOfProject={headOfProjectObject}
          currentUser={currentUser}
        />
      )}
      <ToggleButtonsRow
        setToggle={setToggle}
        toggle={toggle}
        selectedMembers={selectedMembers}
        members={members}
      />
      <UsersTable
        members={members}
        toggle={toggle}
        setToggle={setToggle}
        Users={Users}
        setSelectedMembers={setSelectedMembers}
        selectedMembers={selectedMembers}
        currentUser={currentUser}
      />
      <SelectedMembers
        selectedMembers={selectedMembers}
        setSelectedMembers={setSelectedMembers}
        toggle={toggle}
        resetData={resetData}
        id={id}
        token={token}
      />
    </div>
  );
}
