import { useNavigate } from "react-router-dom";

export default function ProjectForm({
  formData,
  handleChange,
  handleSubmit,
  err,
  submitLabel,
}) {
  const navigate = useNavigate();
  console.log(formData.StartDate);
  return (
    <div className="min-h-[calc(100vh-88px)] h-full w-full pt-[100px]">
      <form
        className="relative flex gap-2 flex-col justify-start rounded-xl items-center h-[65vh] mx-auto w-[calc(100vw-40px)] xs:max-w-[400px] sm:max-w-[500px] bg-gradient-to-br from-white to-blue-50 bg-transparent shadow-xl"
        onSubmit={handleSubmit}
      >
        {submitLabel === "Update Project" && (
          <button
            className="flex self-end w-6 h-6 text-gray-500 text-3xl items-center cursor-pointer font-semibold justify-center rounded-lg transition duration-400 ease-in-out hover:text-black"
            onClick={() => navigate(-1)}
          >
            ×
          </button>
        )}
        <h1 className="text-4xl sm:text-5xl pt-4 font-semibold text-dark-blue">
          {submitLabel}
        </h1>

        <input
          name="Title"
          type="text"
          value={formData.Title}
          placeholder="Project Title"
          onChange={handleChange}
          className="border-1 border-gray-300 rounded-md bg-white h-10 w-[calc(100%-40px)] xs:max-w-[360px] mt-4 hover:border-gray-500 pl-2"
        />
        <label className="flex justify-between items-center w-[calc(100%-40px)] xs:max-w-[360px]">
          Start Date
          <input
            required
            name="StartDate"
            type="datetime-local"
            value={formData.StartDate}
            onChange={handleChange}
            className="border-1 border-gray-300 rounded-md bg-white h-10 max-w-[320px] hover:border-gray-500 pl-2"
          />
        </label>
        <label className="flex justify-between items-center w-[calc(100%-40px)] xs:max-w-[360px]">
          End Date
          <input
            required
            name="EndDate"
            type="datetime-local"
            value={formData.EndDate}
            onChange={handleChange}
            className="border-1 border-gray-300 rounded-md bg-white h-10 max-w-[320px] hover:border-gray-500 pl-2"
          />
        </label>
        <textarea
          name="Description"
          value={formData.Description}
          placeholder="Project Description"
          onChange={handleChange}
          className="border-1 border-gray-300 rounded-md bg-white min-h-[100px] max-h-[200px] w-[calc(100%-40px)] xs:max-w-[360px] hover:border-gray-500 p-2 resize-none mt-2"
        />

        <input
          name="ClientName"
          type="text"
          value={formData.ClientName}
          placeholder="Client Name"
          onChange={handleChange}
          className="border-1 border-gray-300 rounded-md bg-white h-10 w-[calc(100%-40px)] xs:max-w-[360px] hover:border-gray-500 pl-2"
        />

        <select
          required
          onChange={handleChange}
          value={formData.Priority}
          name="Priority"
          className="border-1 border-gray-300 rounded-md bg-white h-10 w-[calc(100%-40px)] xs:max-w-[360px] hover:border-gray-500 pl-2"
        >
          <option value={0} disabled>
            -- Please select a priority --
          </option>
          <option value={1}>Low</option>
          <option value={2}>Medium</option>
          <option value={3}>High</option>
          <option value={4}>Urgent</option>
        </select>

        {err && (
          <h1 className="text-red-600 font-semibold">{err.response.data}</h1>
        )}

        <button
          className="absolute flex justify-center items-center bottom-4 w-2/3 h-12 cursor-pointer bg-custom-blue text-white transition duration-400 ease-in-out font-semibold rounded-md hover:bg-blue-700"
          type="submit"
        >
          {submitLabel}
        </button>
      </form>
    </div>
  );
}
