import axios from "axios";

const axiosInstance = axios.create({
    // Replace with your actual backend URL
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api/v1",
    // This is crucial for your backend to receive/set cookies like AccessToken
    withCredentials: true, 
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;