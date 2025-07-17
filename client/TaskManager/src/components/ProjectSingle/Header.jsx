import { Link } from "react-router-dom";
import editProject from "../../assets/edit-project.png";
import deleteProject from "../../assets/delete-project.png";
export default function Header({
  setToggleMessage,
  title,
  updatedStatusMessage,
  statusAndPriority,
  headOfProject,
  currentUser,
  id,
}) {
  return (
    <>
      {title && (
        <h1 className="flex items-center justify-center font-bold text-2xl text-center md:text-4xl m-2 sm:m-4">
          {title}
        </h1>
      )}
      {updatedStatusMessage && (
        <p className="text-green-600 text-2xl text-center">
          {statusAndPriority.Status !== "" && statusAndPriority.Priority !== ""
            ? "Status and Priority"
            : statusAndPriority.Status !== ""
            ? "Status"
            : "Priority"}{" "}
          has been updated successfully!
        </p>
      )}
      {currentUser === headOfProject && (
        <div className="flex gap-4 self-end m-2 sm:m-4">
          <Link
            to={`/projects/${id}/update-project`}
            className="w-8 h-8 p-1 rounded-md flex items-center justify-center transition duration-400 ease-in-out hover:bg-green-200"
          >
            <img src={editProject} className="h-full w-full" />
          </Link>
          <div className="w-8 h-8 p-1 rounded-md cursor-pointer flex items-center justify-center transition duration-400 ease-in-out hover:bg-red-200">
            <img
              src={deleteProject}
              className="h-full w-full"
              onClick={() => setToggleMessage(true)}
            />
          </div>
        </div>
      )}
    </>
  );
}
