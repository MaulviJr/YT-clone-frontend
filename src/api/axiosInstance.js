import axios from "axios";

const axiosInstance = axios.create({
    // Replace with your actual backend URL
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // This is crucial for your backend to receive/set cookies like AccessToken
    withCredentials: true, 
    
});

export default axiosInstance;