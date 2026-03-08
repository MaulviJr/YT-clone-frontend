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

export const createTweet = createAsyncThunk("tweets/create", async (content) => {
    try {
        const response = await tweetService.createTweet({ content });
        return response;
    } catch (error) {
        throw error.response?.data || error;
    }
});

export const deleteTweet = createAsyncThunk("tweets/delete", async (tweetId) => {
    try {
        await tweetService.deleteTweet(tweetId);
        return tweetId;
    } catch (error) {
        throw error.response?.data || error;
    }
});

export const updateTweet = createAsyncThunk("tweets/update", async ({ tweetId, content }) => {
    try {
        const response = await tweetService.updateTweet(tweetId, { content });
        return { tweetId, content };
    } catch (error) {
        throw error.response?.data || error;
    }
});

const initialState = {
    tweets: [],
    isLoading: false,
    isPosting: false,
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
            })
            .addCase(createTweet.pending, (state) => {
                state.isPosting = true;
            })
            .addCase(createTweet.fulfilled, (state, action) => {
                state.isPosting = false;
                // Prepend the new tweet so it appears at the top
                if (action.payload) {
                    state.tweets = [action.payload, ...state.tweets];
                }
            })
            .addCase(createTweet.rejected, (state) => {
                state.isPosting = false;
            })
            .addCase(deleteTweet.fulfilled, (state, action) => {
                state.tweets = state.tweets.filter((t) => t._id !== action.payload);
            })
            .addCase(updateTweet.fulfilled, (state, action) => {
                const { tweetId, content } = action.payload;
                const tweet = state.tweets.find((t) => t._id === tweetId);
                if (tweet) tweet.content = content;
            });
    }
})

export const { setTweets } = tweetSlice.actions;
export default tweetSlice.reducer;