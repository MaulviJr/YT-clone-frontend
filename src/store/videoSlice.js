import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';
import videoService from '../api/video.service';

export const getVideos = createAsyncThunk("videos/fetchAll", (queryParams) => {
    return videoService.fetchVideos(queryParams);
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
            .addCase(getVideos.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getVideos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.videos = action.payload;
            })
            .addCase(getVideos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { setVideos } = videoSlice.actions;
export default videoSlice.reducer;