import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../feature/auth/state/auth.slice'
import productReducer from '../feature/product/state/product.slice'
import cartReducer from '../feature/product/state/cart.slice';

export const store = configureStore({
    reducer:{
        auth:authReducer,
        product:productReducer,
        cart:cartReducer
    }
})