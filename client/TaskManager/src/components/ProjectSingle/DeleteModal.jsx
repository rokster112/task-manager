export default function DeleteModal({
  toggleMessage,
  setToggleMessage,
  handleDelete,
}) {
  return (
    <div
      className={`absolute top-[30%] left-[50%] ${
        toggleMessage ? "opacity-100 visible" : "opacity-0 hidden"
      } transform -translate-x-[50%] -translate-y-[50%] bg-white w-[330px] sm:w-[500px] flex flex-col items-center justify-center h-[300px] rounded-md`}
    >
      <h1 className="text-center text-2xl font-semibold mb-8">
        Are you sure you want to delete this project?
      </h1>
      <div className="flex flex-row">
        <button
          className="bg-red-600 w-14 p-2 rounded-md text-white font-semibold mr-4 cursor-pointer hover:bg-red-800"
          onClick={handleDelete}
        >
          Yes
        </button>
        <button
          className="bg-slate-800 w-12 p-2 rounded-md text-white font-semibold cursor-pointer hover:bg-black"
          onClick={() => setToggleMessage(false)}
        >
          No
        </button>
      </div>
    </div>
  );
}
