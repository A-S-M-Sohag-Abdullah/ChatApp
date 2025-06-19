import axios from "axios";
const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_NEXT_PUBLIC_API_BASE_URL}`, // e.g., http://localhost:5000
  withCredentials: true, // for sending cookies with auth
});

export default axiosInstance;
