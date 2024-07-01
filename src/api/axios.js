import Axios from "axios";

export const getToken = () => {
  const TOKEN = sessionStorage.getItem("TOKEN");
  return TOKEN;
};

const axios = Axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Accept-Language": "en-US,en;q=0.9,ar-EG;q=0.8,ar;q=0.7,nl;q=0.6",
  },
});

axios.interceptors.request.use(
  function (config) {
    config.headers["Authorization"] = `Bearer ${getToken()}`;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log(response);
    return response;
  },
  function (error) {
    if (error.message === "Network Error") {
      // toast.error("network_error");
    } else if (error.response.status === 404) {
      // toast.error("not_found");
    } else if (error.response.status === 401) {
      // logoutFunc();
      // window.location.href = "/auth/signin";
      console.log(error);
    } else if (error.response.status === 403) {
      window.location.href = "/403";
    } else if (error.response.data) {
      // toast.error(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axios;
