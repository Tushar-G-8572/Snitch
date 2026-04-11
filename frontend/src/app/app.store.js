import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../feature/auth/state/authSlice'

export const store = configureStore({
    reducer:{
        auth:authReducer,
    }
})