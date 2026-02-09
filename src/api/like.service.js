import axiosInstance from "./axiosInstance";

export class likeService {

    async toggleVideoLike(videoId) {
        try {
            const response = await axiosInstance.post(`/likes/toggle/v/${videoId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }

    }

    async getLikedVideos() {
        try {
            const response = await axiosInstance.get("/likes/videos");
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async ToggleCommentLike(commentId) {
        try {
            const response = await axiosInstance.post(`/likes/toggle/c/${commentId}`);
            return response.data.data;
         } catch (error) {
            throw error.response?.data || error;
        }
    }

    async ToggleTweetLike(tweetId) {
        try {
            const response = await axiosInstance.post(`/likes/toggle/t/${tweetId}`);
            return response.data.data;
         } catch (error) {
            throw error.response?.data || error;
        }
    }

}

const likeService = new likeService();
export default likeService;