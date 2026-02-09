import axiosInstance from "./axiosInstance";

export class subscriptionService {

    async toggleSubscription(channelId) {
        try {
            const response = await axiosInstance.post(`/subscriptions/c/${channelId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }

    }

    async getSubscribedChannels(subscriberId) {
        try {
            const response = await axiosInstance.get(`/subscriptions/u/${subscriberId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async getUserChannelSubscribers(channelId) {
        try {
            const response = await axiosInstance.get(`/subscriptions/c/${channelId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }


}

const subscriptionService = new subscriptionService();
export default subscriptionService;