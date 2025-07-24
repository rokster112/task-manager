import axios from "../api/axiosInstance";

export async function fetchProjectHead(id) {
  const response = await axios.get(`projects/${id}/head`);
  return response.data;
}

export async function fetchMembers(id) {
  const response = await axios.get(`projects/${id}/members`);
  return response.data;
}

export async function fetchProjectMembers(id) {
  const response = await axios.get(`projects/${id}/project-members`);
  return response.data;
}

export async function fetchProject(id) {
  const response = await axios.get(`projects/${id}`);
  return response.data;
}
