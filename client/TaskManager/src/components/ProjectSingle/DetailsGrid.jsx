import axios from "axios";
import DetailsGridPriority from "./DetailsGrid/DetailsGridPriority";
import DetailsGridStatus from "./DetailsGrid/DetailsGridStatus";
import DetailsGridInfo from "./DetailsGrid/DetailsGridInfo";
const API = import.meta.env.VITE_API;

export default function DetailsGrid({
  project,
  setStatusAndPriority,
  statusAndPriority,
  token,
  id,
  setProject,
  setUpdatedStatusMessage,
  currentUser,
}) {
  const { Status, StartDate, Priority, EndDate, ClientName, CreatedAt } =
    project;
  const indexOfT = project && StartDate.indexOf("T");
  function handleChange(e) {
    const { name, value } = e.target;
    setStatusAndPriority((prev) => ({ ...prev, [name]: Number(value) }));
  }

  async function handleStatusUpdate() {
    try {
      const response = await axios.patch(
        `${API}/projects/${id}/status-priority`,
        {
          Status:
            statusAndPriority.Status === "" ? null : statusAndPriority.Status,
          Priority:
            statusAndPriority.Priority === ""
              ? null
              : statusAndPriority.Priority,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUpdatedStatusMessage(true);
      setProject((prev) => ({
        ...prev,
        Status:
          statusAndPriority.Status !== ""
            ? statusAndPriority.Status
            : prev.Status,
        Priority:
          statusAndPriority.Priority !== ""
            ? statusAndPriority.Priority
            : prev.Priority,
      }));
    } catch (error) {
    } finally {
      setTimeout(() => {
        setUpdatedStatusMessage(false);
        setStatusAndPriority({ Status: "", Priority: "" });
      }, 2000);
    }
  }

  return (
    <div className="h-fit grid grid-cols-2 sm:flex sm:flex-col bg-[#feffff] rounded-xl p-2 m-2 md:p-6 md:m-6 shadow-xl">
      <DetailsGridStatus
        Status={Status}
        handleChange={(e) => handleChange(e)}
        statusAndPriority={statusAndPriority}
        setStatusAndPriority={setStatusAndPriority}
        handleStatusUpdate={handleStatusUpdate}
        headOfProject={project.HeadOfProject.UserId}
        currentUser={currentUser}
      />
      <DetailsGridPriority
        Priority={Priority}
        handleChange={(e) => handleChange(e)}
        statusAndPriority={statusAndPriority}
        setStatusAndPriority={setStatusAndPriority}
        handleStatusUpdate={handleStatusUpdate}
        headOfProject={project.HeadOfProject.UserId}
        currentUser={currentUser}
      />
      <DetailsGridInfo
        StartDate={StartDate}
        EndDate={EndDate}
        CreatedAt={CreatedAt}
        ClientName={ClientName}
      />
    </div>
  );
}
