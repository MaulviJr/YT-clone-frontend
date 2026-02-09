import axiosInstance from "./axiosInstance";

export class playlistService {

    async createPlaylist(playlistData) {
        try {
            const response = await axiosInstance.post("/playlists/", playlistData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async getPlaylistById(playlistId) {
        try {
            const response = await axiosInstance.get(`/playlists/${playlistId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }

    }

    async updatePlaylist(playlistId, playlistData) {
        try {
            const response = await axiosInstance.patch(`/playlists/${playlistId}`, playlistData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async deletePlaylist(playlistId) {
        try {
            const response = await axiosInstance.delete(`/playlists/${playlistId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async addVideoToPlaylist(playlistId, videoId) {
        try {
            const response = await axiosInstance.patch(`/playlists/add/${videoId}/${playlistId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async removeVideoFromPlaylist(playlistId, videoId) {
        try {
            const response = await axiosInstance.patch(`/playlists/remove/${videoId}/${playlistId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async getUserPlaylists(userId) {
        try {
            const response = await axiosInstance.get(`/playlists/user/${userId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }


}

const playlistService = new playlistService();
export default playlistService;