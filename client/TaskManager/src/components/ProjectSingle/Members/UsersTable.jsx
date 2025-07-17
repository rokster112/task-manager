import Avatar from "../Avatar";

export default function UsersTable({
  members,
  toggle,
  setToggle,
  Users,
  setSelectedMembers,
  selectedMembers,
  currentUser,
}) {
  function addingMembers(memb) {
    let newSelected;

    if (!selectedMembers) {
      newSelected = [memb];
    } else {
      newSelected = [...selectedMembers, memb];
    }

    if (members.length === newSelected.length) {
      setToggle((prev) => ({ ...prev, showAvailable: false }));
    }

    setSelectedMembers(newSelected);
  }
  return (
    <div
      className={`flex flex-row ${
        toggle.showAvailable ? "justify-end" : "justify-between"
      }`}
    >
      {toggle.showCurrent && (
        <div className="w-1/2 max-h-[200px] overflow-auto">
          <div className="max-h-[200px] overflow-y-auto overflow-x-auto">
            {Users.map((u) => (
              <div
                key={u.UserId}
                className={`min-w-[225px] flex-shrink-0 ${
                  currentUser === u.UserId ? "bg-[#a9f0c4]" : "bg-[#feffff]"
                } border-b border-gray-200 flex flex-row p-2 items-center rounded-md`}
              >
                <Avatar
                  avatarUrl={u.AvatarUrl}
                  name={u.FullName}
                  height={"sm:h-16"}
                  width={"sm:w-16"}
                  minHeight={"h-12"}
                  minWidth={"w-12"}
                />
                <div className="ml-2 overflow-hidden">
                  <p className="font-semibold truncate">{u.FullName}</p>
                  <p className="text-gray-500 text-sm truncate">{u.Position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="w-1/2 max-h-[200px] overflow-auto">
        {toggle.showAvailable && (
          <div className="max-h-[200px] overflow-y-auto overflow-x-auto">
            {members && members.length > 0 ? (
              members
                .filter((m) =>
                  selectedMembers
                    ? !selectedMembers.some((s) => s.UserId === m.UserId)
                    : true
                )
                .map((filteredMemb) => (
                  <div
                    key={filteredMemb.UserId}
                    onClick={() => addingMembers(filteredMemb)}
                    className="min-w-[225px] flex-shrink-0 bg-[#feffff] border-b border-gray-200 flex flex-row p-2 items-center cursor-pointer"
                  >
                    <Avatar
                      avatarUrl={filteredMemb.AvatarUrl}
                      name={filteredMemb.FullName}
                      height={"sm:h-16"}
                      width={"sm:w-16"}
                      minHeight={"h-12"}
                      minWidth={"w-12"}
                    />
                    <div className="ml-2 overflow-hidden">
                      <p className="font-semibold truncate">
                        {filteredMemb.FullName}
                      </p>
                      <p className="text-gray-500 text-sm truncate">
                        {filteredMemb.Position}
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <p>No members to display</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
