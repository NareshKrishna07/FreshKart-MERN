import axios from "axios";

// base url for our backend API
// during development this points to local backend server
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;
