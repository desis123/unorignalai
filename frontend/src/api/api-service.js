import axios from "axios";

export const API_ENDPOINT =
  process.env.REACT_APP_API_ENDPOINT ||
  `http://localhost:${process.env.REACT_APP_SERVER_PORT || 4000}`;

export const post = (url, data, token) =>
  axios.post(`${API_ENDPOINT}/${url}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

export const get = (url, token, userData) =>
  axios.get(`${API_ENDPOINT}/${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userData,
  });
