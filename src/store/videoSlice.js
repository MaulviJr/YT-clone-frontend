import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

export const fetchVideos = createAsyncThunk("videos/fetchAll", async ({ query = "", category = "" }) => {
    const response = await axiosInstance.get(`/videos`, { params: { query, category } });
    return response.data.data; 
});

const videoSlice = createSlice({
    name: 'videos',
    initialState: {
        videos: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        setVideos: (state, action) => {
            state.videos = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVideos.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchVideos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.videos = action.payload;
            })
            .addCase(fetchVideos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { setVideos } = videoSlice.actions;
export default videoSlice.reducer;