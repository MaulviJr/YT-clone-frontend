import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './authSlice';
import videoReducer from './videoSlice';
import tweetReducer from './tweetSlice';
const store = configureStore({
    reducer: {
        auth: authSlice.reducer
        ,videos: videoReducer,
        tweets: tweetReducer
    }
});

export default store;