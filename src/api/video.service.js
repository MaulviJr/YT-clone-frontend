import axiosInstance from "./axiosInstance";

export class VideoService {
    async fetchVideos(queryParams) {
        try {
            const response = await axiosInstance.get("/videos", { params: queryParams });
            return response.data.data; 
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async getVideoById(videoId) {
        try {
            const response = await axiosInstance.get(`/videos/${videoId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }}

    async publishVideo(videoData) {
        try {
            const response = await axiosInstance.post("/videos", videoData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async updateVideo(videoId, videoData) {
        try {
            const response = await axiosInstance.patch(`/videos/${videoId}`, videoData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        } 
    }

    async deleteVideo(videoId) {
        try {
            const response = await axiosInstance.delete(`/videos/${videoId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async togglePublishStatus(videoId) {
        try {
            const response = await axiosInstance.patch(`/videos/toggle/publish/${videoId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }


}

const videoService = new VideoService();
export default videoService;