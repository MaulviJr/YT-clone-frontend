import axiosInstance from "./axiosInstance";

export class SubscriptionService {

    async toggleSubscription(channelId) {
        try {
            const response = await axiosInstance.post(`/subscription/c/${channelId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }

    }

    async getSubscribedChannels(subscriberId) {
        try {
            const response = await axiosInstance.get(`/subscription/u/${subscriberId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async getUserChannelSubscribers(channelId) {
        try {
            const response = await axiosInstance.get(`/subscription/c/${channelId}`);
            console.log("Subscribers response:", response);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }


}

const subscriptionService = new SubscriptionService();
export default subscriptionService;