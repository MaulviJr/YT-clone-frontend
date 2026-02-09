import axiosInstance from "./axiosInstance";

export class dashboardService {

    async getChannelVideos() {
        try {
            const response = await axiosInstance.get("/dashboard/videos/");
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
    async getChannelStats() {
        try {
            const response = await axiosInstance.get(`/dashboard/stats`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }

    }
}

export const dashboardService = new dashboardService();
export default dashboardService;