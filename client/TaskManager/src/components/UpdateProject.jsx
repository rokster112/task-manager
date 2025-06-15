import { useState } from "react";

export default function UpdateProject() {
  const [formData, setFormData] = useState({
    Title: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  console.log(formData);

  return (
    <div className="flex flex-col">
      <form>
        <input
          name="Title"
          type="text"
          value={formData.Title}
          onChange={(e) => handleChange(e)}
          className="flex border-1 rounded-sm border-red-500 bg-white"
        />
        <input
          name="Description"
          type="text"
          value={formData.Description}
          onChange={(e) => handleChange(e)}
          className="flex border-1 rounded-sm border-red-500 bg-white"
        />
        <button>√</button>
      </form>
    </div>
  );
}
