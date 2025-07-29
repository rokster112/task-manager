import axios from "../api/axiosInstance";

export async function fetchTasks(id) {
  const response = await axios.get(`/projects/${id}/tasks`);
  return response.data;
}

export async function fetchTask(id, taskId) {
  const response = await axios.get(`/projects/${id}/tasks/${taskId}`);
  return response.data;
}

export async function fetchHeadOfProject(id) {
  const response = await axios.get(`/projects/${id}`);
  return response.data;
}

export async function deleteTask(id, taskId) {
  const response = await axios.delete(`/projects/${id}/tasks/${taskId}`);
  return response.data;
}

export async function updateTask(id, taskId, formData) {
  const response = await axios.patch(
    `/projects/${id}/tasks/${taskId}`,
    formData
  );
  return response.data;
}

export async function postTask(id, formData) {
  if (!formData.DueBy) {
    throw new Error("Please select due by date");
  }
  const response = await axios.post(`/projects/${id}/tasks`, formData);
  return response.data;
}

export async function fetchTaskMembers(projectId, taskId = null) {
  const url =
    taskId === null
      ? `/projects/${projectId}/tasks/members`
      : `/projects/${projectId}/tasks/${taskId}/members`;
  const response = await axios.get(`${url}`);
  return response.data;
}
