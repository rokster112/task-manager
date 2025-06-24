import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Members/Header";
import ToggleButtonsRow from "./Members/ToggleButtonsRow";
import UsersTable from "./Members/UsersTable";
import SelectedMembers from "./Members/SelectedMembers";
const API = import.meta.env.VITE_API;

export default function Members({
  project,
  id,
  token,
  fetchProjectData,
  currentUser,
}) {
  const { HeadOfProject, Users } = project;
  const [members, setMembers] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState(null);
  const [toggle, setToggle] = useState({
    showCurrent: false,
    showAvailable: false,
    showSelection: false,
  });

  // console.log("Members token", token);

  async function fetchData() {
    try {
      const response = await axios.get(`${API}/projects/${id}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMembers(response.data);
    } catch (error) {
      console.error("errror ======>", error);
    }
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
    if (currentUser === HeadOfProject.UserId) fetchData();
  }, []);

  return (
    <div className=" bg-[#feffff] rounded-xl p-2 m-2 md:p-6 md:m-6 shadow-xl relative">
      <Header
        toggle={toggle}
        setToggle={setToggle}
        setSelectedMembers={setSelectedMembers}
        HeadOfProject={HeadOfProject}
        currentUser={currentUser}
      />
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
