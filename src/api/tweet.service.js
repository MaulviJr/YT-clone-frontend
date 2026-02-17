import axiosInstance from "./axiosInstance";

export class TweetService {

    async createTweet(tweetData) {
        try {
            const response = await axiosInstance.post("/tweets", tweetData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }}

    async getTweetsByUser(userId) {
        try {
            const response = await axiosInstance.get(`/tweets/user/${userId}`);
            console.log("response from tweetService: ", response)
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async deleteTweet(tweetId) {
        try {
            const response = await axiosInstance.delete(`/tweets/${tweetId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async updateTweet(tweetId, updatedData) {
        try {
            const response = await axiosInstance.patch(`/tweets/${tweetId}`, updatedData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
}

const tweetService = new TweetService();
export default tweetService;