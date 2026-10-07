import axios from "axios";

const api = axios.create({
  baseURL: "/",
});

const accessToken = sessionStorage.getItem("accessToken");
if (accessToken) {
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

export default api;