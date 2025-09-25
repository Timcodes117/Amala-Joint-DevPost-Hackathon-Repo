import axios, { AxiosRequestHeaders } from "axios";

const headers = {
  "Content-Type": "application/json",
};

// Flask backend server URL - set via env NEXT_PUBLIC_API_BASE_URL, fallback to localhost
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

export const axiosPost = async (
  endpoint: string,
  data: FormData | Record<string, string | number> = {},
  additionalHeaders?: AxiosRequestHeaders
) => {
  return axios.post(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}` , data, {
    headers: { ...headers, ...additionalHeaders },
  });
};

export const axiosPostMultiPart = async (
  endpoint: string,
  file: FormData,
  additionalHeaders?: AxiosRequestHeaders
) => {
  return axios.post(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}` , file, {
    headers: { ...headers, ...additionalHeaders, "Content-Type": "multipart/form-data" },
  });
};

export const axiosGet = async (
  endpoint: string,
  additionalHeaders?: AxiosRequestHeaders
) => {
  return axios.get(`${endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`}`, {
    headers: { ...headers, ...additionalHeaders },
  });
};

export const axiosDelete = async (
  endpoint: string,
  additionalHeaders?: AxiosRequestHeaders
) => {
  return axios.delete(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}` , {
    headers: { ...headers, ...additionalHeaders },
  });
};
