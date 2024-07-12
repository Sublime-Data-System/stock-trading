import axios from "axios";

const API_URL = "https://your-api-url.com";

export const register = (username: string, email: string, password: string) => {
  return axios.post(`${API_URL}/register`, {
    username,
    email,
    password,
  });
};

export const login = (username: string, password: string) => {
  return axios.post(`${API_URL}/login`, {
    username,
    password,
  });
};
