import axiosInstance from "./axiosInstance";

export class commentService {

    async createComment(videoId, commentData) {
        try {
            const response = await axiosInstance.post(`/comments/${videoId}`, commentData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async getVideoComments(videoId) {
        try {
            const response = await axiosInstance.get(`/comments/${videoId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async updateComment(commentId, commentData) {
        try {
            const response = await axiosInstance.patch(`/comments/c/${commentId}`, commentData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async deleteComment(commentId) {
        try {
            const response = await axiosInstance.delete(`/comments/c/${commentId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

}

const commentService = new commentService();
export default commentService;