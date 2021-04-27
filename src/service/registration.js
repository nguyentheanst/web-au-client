import axios from "axios";

export const registrationStart = (data) => {
  return axios.post(`/api/registration/start?username=${data}`, null, {
    withCredentials: true,
  });
};

export const registrationFinish = (data) => {
  return axios.post(`/api/registration/finish`, data, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
