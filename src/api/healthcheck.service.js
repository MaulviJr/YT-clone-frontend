import axiosInstance from "./axiosInstance";

export class healthCheckService {

async checkServerHealth() {
    try {
        const response = await axiosInstance.get("/healthcheck");
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

}

const healthCheckService = new healthCheckService();
export default healthCheckService;