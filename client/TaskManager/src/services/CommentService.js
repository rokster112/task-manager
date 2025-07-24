import axios from "axios";
import customAxios from "../api/axiosInstance";
const API_IMAGE_UPLOAD = import.meta.env.VITE_API_IMAGE_UPLOAD;
const API_IMAGE_PRESET = import.meta.env.VITE_API_PRESET;

export async function fetchComments(id) {
  const response = await customAxios.get(`/tasks/${id}/comments`);
  return response.data;
}

export async function postComment(id, formData) {
  const response = await customAxios.post(`/tasks/${id}/comments`, formData);
  return response.data;
}

export async function deleteComment(id, commentId) {
  const response = await customAxios.delete(
    `/tasks/${id}/comments/${commentId}`
  );
  return response.data;
}

export async function updateComment(id, commentId, formData) {
  const response = await customAxios.patch(
    `/tasks/${id}/comments/${commentId}`,
    formData
  );
  return response.data;
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", API_IMAGE_PRESET);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${API_IMAGE_UPLOAD}/image/upload`,
    formData
  );

  console.log("Cloudinary response:", response.data);
  return response.data.secure_url;
}
