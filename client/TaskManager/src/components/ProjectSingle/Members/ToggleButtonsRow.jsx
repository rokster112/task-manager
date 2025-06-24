import { ChevronDown, ChevronUp } from "lucide-react";

export default function ToggleButtonsRow({
  setToggle,
  toggle,
  selectedMembers,
  members,
}) {
  return (
    <div className="flex flex-row justify-between">
      <button
        onClick={() =>
          setToggle((prev) => ({ ...prev, showCurrent: !prev.showCurrent }))
        }
        className="cursor-pointer flex flex-row items-center border-b-1 border-gray-200 pb-2 h-[57px]"
      >
        Members
        {toggle.showCurrent ? (
          <ChevronUp className="ml-4" size={18} strokeWidth={1.5} />
        ) : (
          <ChevronDown className="ml-4" size={18} strokeWidth={1.5} />
        )}
      </button>
      {toggle.showSelection && (
        <div className="flex flex-col w-1/2">
          <button
            onClick={() =>
              setToggle((prev) => ({
                ...prev,
                showAvailable: !prev.showAvailable,
              }))
            }
            disabled={
              selectedMembers && selectedMembers.length === members.length
            }
            className="cursor-pointer flex flex-row items-center border-b-1 border-gray-200 pb-2 h-[57px]"
          >
            Available Members
            {toggle.showAvailable ? (
              <ChevronUp className="ml-4" size={18} strokeWidth={1.5} />
            ) : (
              <ChevronDown className="ml-4" size={18} strokeWidth={1.5} />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
