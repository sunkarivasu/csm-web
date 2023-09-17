import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    errors: {}
};

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        adminLoginRequest: (state) => {
            state.loading = true;
            state.errors = {};
        },
        adminLoginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        adminUpdatePassword: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = action.payload;
        },
        adminLoginFail: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.errors = action.payload;
        },
        adminLogout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
        adminClearErrors: (state) => {
            state.errors = null;
        }
    }
});

export const { adminLoginRequest, adminLoginSuccess, adminLoginFail, adminLogout, adminClearErrors, adminUpdatePassword } = adminSlice.actions;

export default adminSlice.reducer;