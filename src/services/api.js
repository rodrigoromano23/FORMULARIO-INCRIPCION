/*import axios from "axios";

const api = axios.create({
  baseURL: "https://formulario-backend-bz2a.onrender.com/api"
});

export default api;*/

import axios from "axios";

const api = axios.create({
  baseURL: "https://formulario-backend-bz2a.onrender.com/api"
});

// Este "interceptor" pega la contraseña automáticamente en cada mensaje que envías
api.interceptors.request.use((config) => {
  const adminPassword = localStorage.getItem("adminPassword");
  if (adminPassword) {
    config.headers.Authorization = adminPassword;
  }
  return config;
});

export default api;