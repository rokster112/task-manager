import axios from "axios";
const API = import.meta.env.VITE_API;

export default function SelectedMembers({
  selectedMembers,
  toggle,
  resetData,
  id,
  token,
  setSelectedMembers,
}) {
  function removingSelectedMembers(memb) {
    const filteredArr = selectedMembers.filter((m) => m.UserId !== memb.UserId);
    setSelectedMembers(filteredArr);
  }

  async function postMembers() {
    try {
      const response = await axios.patch(
        `${API}/projects/${id}/members`,
        selectedMembers,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      resetData();
    } catch (error) {
      console.log("error ==>", error);
    }
  }
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-2">
      {selectedMembers && selectedMembers.length > 0 && (
        <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto bg-[#fafbff] p-2 rounded-md shadow-inner">
          {selectedMembers.map((m) => (
            <div
              key={m.UserId}
              className="flex items-center gap-1 bg-white px-2 py-1 rounded shadow text-sm"
            >
              <p className="font-semibold">{m.FullName}</p>
              <button
                className="text-red-700 text-lg leading-none cursor-pointer"
                onClick={() => removingSelectedMembers(m)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {!toggle.showAvailable &&
        selectedMembers &&
        selectedMembers.length > 0 && (
          <button
            onClick={postMembers}
            className="bg-green-500 transition duration-400 ease-in-out hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow cursor-pointer"
          >
            Submit
          </button>
        )}
    </div>
  );
}
