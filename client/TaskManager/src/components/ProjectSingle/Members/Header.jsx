import Avatar from "../Avatar";
import addMembers from "../../../assets/add-members.png";
import cancel from "../../../assets/cancel.png";

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
              toggle.showSelection ? "hover:bg-red-200" : "hover:bg-green-200"
            } py-2 px-1 lg:px-4 rounded-md transition duration-400 ease-in-out cursor-pointer place-self-end`}
          >
            <img
              src={toggle.showSelection ? cancel : addMembers}
              className={`${toggle.showSelection ? "h-6 w-6" : "h-8 w-8"}`}
            />
          </button>
        )}
      </div>
      <div className="border-b-1 border-gray-200 flex flex-row p-2 pt-0 items-center">
        <Avatar
          avatarUrl={HeadOfProject.AvatarUrl}
          name={HeadOfProject.FullName}
          height={"sm:h-16"}
          width={"sm:w-16"}
          minHeight={"h-12"}
          minWidth={"w-12"}
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
