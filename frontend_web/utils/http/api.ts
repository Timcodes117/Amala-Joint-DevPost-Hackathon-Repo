import axios, { AxiosRequestHeaders } from "axios";

const headers = {
  "Content-Type": "application/json",
};

// Flask backend server URL - change this to your actual server URL
const API_BASE_URL = "https://api.com/";

export const axiosPost = async (
  endpoint: string,
  data: FormData | Record<string, string | number> = {},
  additionalHeaders?: AxiosRequestHeaders
) => {
  return axios.post(`${API_BASE_URL}${endpoint}`, data, {
    headers: { ...headers, ...additionalHeaders },
  });
};

export const axiosPostMultiPart = async (
  endpoint: string,
  file: FormData,
  additionalHeaders?: AxiosRequestHeaders
) => {
  return axios.post(`${API_BASE_URL}${endpoint}`, file, {
    headers: { ...headers, ...additionalHeaders, "Content-Type": "multipart/form-data" },
  });
};

export const axiosGet = async (
  endpoint: string,
  additionalHeaders?: AxiosRequestHeaders
) => {
  return axios.get(`${endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`}`, {
    headers: { ...headers, ...additionalHeaders },
  });
};

export const axiosDelete = async (
  endpoint: string,
  additionalHeaders?: AxiosRequestHeaders
) => {
  return axios.delete(`${API_BASE_URL}${endpoint}`, {
    headers: { ...headers, ...additionalHeaders },
  });
};
