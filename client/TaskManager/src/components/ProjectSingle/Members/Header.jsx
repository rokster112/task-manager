import Avatar from "../Avatar";

export default function Header({
  toggle,
  setSelectedMembers,
  setToggle,
  HeadOfProject,
  currentUser,
}) {
  return (
    <>
      <div className="flex flex-row sm:flex-col-reverse md:flex-row justify-between">
        <p className="text-gray-500 mb-2 md:text-xl">Head of Project</p>
        {HeadOfProject.UserId === currentUser && (
          <button
            onClick={() => {
              setToggle((prev) => ({
                ...prev,
                showSelection: !prev.showSelection,
                showAvailable: false,
              }));
              setSelectedMembers(null);
            }}
            className={`max-w-[138px] ${
              toggle.showSelection
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-500 hover:bg-green-600"
            } text-white font-semibold py-2 px-1 lg:px-4 rounded-md transition duration-400 ease-in-out cursor-pointer place-self-end`}
          >
            {toggle.showSelection ? "Close" : "Add Members"}
          </button>
        )}
      </div>
      <div className="border-b-1 border-gray-200 flex flex-row p-2 pt-0 items-center">
        <Avatar
          avatarUrl={HeadOfProject.AvatarUrl}
          name={HeadOfProject.FullName}
        />
        <div className="min-w-150px ml-2">
          <span className="text-black font-semibold md:text-xl">
            {HeadOfProject?.FullName}
          </span>
          <p className="text-gray-500">{HeadOfProject?.Position}</p>
        </div>
      </div>
    </>
  );
}
