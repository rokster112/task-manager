import axios from "../api/axiosInstance";

export async function fetchUserProjects(query = "") {
  const response = await axios.get(`/home/projects/${query}`);
  return response.data;
}

export async function fetchUserTasks(query = "") {
  const response = await axios.get(`/home/tasks/${query}`);
  return response.data;
}

export async function fetchCalendarDates() {
  const response = await axios.get("/home/calendar-dates");
  return response.data;
}

export async function safeApiCall(apiFunc) {
  try {
    const data = await apiFunc();
    return { data };
  } catch (error) {
    const errorMsg =
      error.response?.data || error.message || "Something went wrong";
    return { error: errorMsg };
  }
}
