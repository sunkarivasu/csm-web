import { configureStore } from '@reduxjs/toolkit';
import adminReducer from '../reducers/admin';

export const store = configureStore({
    reducer: {
        admin: adminReducer
    }
});