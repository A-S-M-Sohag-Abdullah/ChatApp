import axios from "axios";
const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_NEXT_PUBLIC_API_BASE_URL}`, 
  withCredentials: true, // for sending cookies with auth
});
console.log(process.env.REACT_APP_NEXT_PUBLIC_API_BASE_URL);
export default axiosInstance;
