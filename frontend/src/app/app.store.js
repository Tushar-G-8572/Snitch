import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../feature/auth/state/auth.slice'
import productReducer from '../feature/product/state/product.slice'
import cartReducer from '../feature/product/state/cart.slice';
import wishlistReducer from '../feature/product/state/wishlist.slice'

export const store = configureStore({
    reducer:{
        auth:authReducer,
        product:productReducer,
        cart:cartReducer,
        wishlist:wishlistReducer
    }
})