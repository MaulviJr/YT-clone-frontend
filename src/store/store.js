import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './authSlice';
import videoReducer from './videoSlice';
const store = configureStore({
    reducer: {
        auth: authSlice.reducer
        ,videos: videoReducer,
    }
});

export default store;