import axiosInstance from "./axiosInstance";

export class AuthService {

    async createAccount(formData) {
        const response = await axiosInstance.post(
            "/users/register",
            formData
        );

        return response.data.data;
    }


    async login(formData) {
        try {
            // Your backend accepts (username || email)
            const response = await axiosInstance.post("/users/login", formData);
            console.log("AuthService :: login :: response", response);
            return response.data.data; // Returns the loggedInUser
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    // 3. Get Current User (Matches your getCurrentUser controller)
    async getCurrentUser() {
        try {
            const response = await axiosInstance.get("/users/get-user");
            return response.data.data;
        } catch (error) {
            // Silently fail if no user is found (not logged in)
            return null;
        }
    }

    // 4. Logout (Matches your logoutUser controller)
    async logout() {
        try {
            await axiosInstance.post("/users/logout");
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async getProfile(userId) {
        try {
            const response = await axiosInstance.get(`/users/c/${userId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
}

    async changePassword(passwordData) {
        try {
            const response = await axiosInstance.post("/users/change-password", passwordData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
}

    async updateDetails(detailsData) {
        try {
            const response = await axiosInstance.patch("/users/update-details", detailsData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async updateAvatar(avatarData) {
        try {
            const response = await axiosInstance.patch("/users/update-avatar", avatarData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }}

    async updateCoverImage(coverImageData) {
        try {
            const response = await axiosInstance.patch("/users/update-cover", coverImageData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }}

    async getWatchHistory() {
        try {
            const response = await axiosInstance.get("/users/get-history");
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async refreshToken() {
        try {
            const response = await axiosInstance.post("/users/refresh-token");
            return response.data.data; // Assuming it returns new tokens
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async getChannelInfo(username) {
        try {
            const response = await axiosInstance.get(`/users/c/${username}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
    
}
const authService = new AuthService();
export default authService;