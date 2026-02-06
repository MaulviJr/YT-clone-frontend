import axiosInstance from "./axiosInstance";

export class AuthService {

    async createAccount(formData) {
  const response = await axiosInstance.post(
    "/users/register",
    formData
  );

  return response.data;
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
}

const authService = new AuthService();
export default authService;