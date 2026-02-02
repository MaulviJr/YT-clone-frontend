import axiosInstance from "./axiosInstance";

export class AuthService {
    // 1. Create Account (Matches your registerUser controller)
    // async createAccount({ fullName, email, username, password, avatar, coverImage }) {
    //     try {
    //         const formData = new FormData();
    //         formData.append("fullName", fullName);
    //         formData.append("email", email);
    //         formData.append("username", username);
    //         formData.append("password", password);
    //         formData.append("avatar", avatar); // Expecting a File object
    //         if (coverImage) formData.append("coverImage", coverImage);

    //         const response = await axiosInstance.post("/users/register", formData, {
    //             headers: { "Content-Type": "multipart/form-data" }
    //         });

    //         if (response.data) {
    //             return this.login({ email, password });
    //         }
    //         return response.data;
    //     } catch (error) {
    //         throw error.response?.data || error;
    //     }
    // }

    async createAccount(formData) {
  const response = await axiosInstance.post(
    "/users/register",
    formData
  );

  return response.data;
}

    // 2. Login (Matches your loginUser controller)
    // async login({ email, username, password }) {
    //     try {
    //         // Your backend accepts (username || email)
    //         const response = await axiosInstance.post("/users/login", {
    //             email,
    //             username,
    //             password
    //         });
    //         return response.data.data; // Returns the loggedInUser
    //     } catch (error) {
    //         throw error.response?.data || error;
    //     }
    // }

       async login(formData) {
        try {
            // Your backend accepts (username || email)
            const response = await axiosInstance.post("/users/login", formData);
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