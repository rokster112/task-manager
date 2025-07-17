import axios from "axios";
const API = import.meta.env.VITE_API;

export async function FetchMemberData(
  id,
  token,
  setMembers,
  setErr,
  taskId = null
) {
  const url =
    taskId === null
      ? `${API}/projects/${id}/tasks/members`
      : `${API}/projects/${id}/tasks/${taskId}/members`;
  try {
    console.log("Url =>", url);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setMembers(response?.data ?? []);
    console.log("Members =>", response);
  } catch (error) {
    console.log("error =>", error);
    setErr(error);
  }
}
