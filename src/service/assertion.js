import axios from "axios";

export const assertionStart = (data) => {
  return axios.post(`/api/assertion/start?username=${data}`, null, {
    withCredentials: true,
  });
};

export const assertionFinish = (data) => {
  return axios.post(`/api/assertion/finish`, data, { withCredentials: true });
};
