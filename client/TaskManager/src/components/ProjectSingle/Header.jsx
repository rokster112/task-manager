import { Link } from "react-router-dom";

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
        <div className="flex gap-2 self-end m-2 sm:m-4">
          <Link
            to={`/projects/${id}/update-project`}
            className="w-24 h-10 bg-green-500 font-semibold rounded-md text-white flex items-center justify-center transition duration-400 ease-in-out hover:bg-green-600"
          >
            Update
          </Link>
          <button
            className="bg-red-600 font-semibold text-white rounded-md p-2 cursor-pointer w-24 h-10 transition duration-400 ease-in-out hover:bg-red-700"
            onClick={() => setToggleMessage(true)}
          >
            Delete
          </button>
        </div>
      )}
    </>
  );
}
