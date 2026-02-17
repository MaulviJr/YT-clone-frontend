import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import tweetService from '../api/tweet.service.js'
export const getTweets = createAsyncThunk("tweets/get", async (userId) => {
    try {
        const response = await tweetService.getTweetsByUser(userId);
        console.log("response from getTweets: ", response)
        return response;
    } catch (error) {
        throw error.response?.data || error;
    }
});

const initialState = {
    tweets: [],
    isLoading: false,
    error: null,
}


const tweetSlice = createSlice({
    name: 'tweets',
    initialState,
    reducers: {
        setTweets: (state, action) => {
            state.tweets = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTweets.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getTweets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tweets = action.payload;
            })
            .addCase(getTweets.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
})

export const { setTweets } = tweetSlice.actions;
export default tweetSlice.reducer;