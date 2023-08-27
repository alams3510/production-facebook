import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://facebuk-app.onrender.com/api/",
});
// "http://13.233.90.168:3001/api/"
// process.env.REACT_APP_BASE_URL
export default axiosInstance;
