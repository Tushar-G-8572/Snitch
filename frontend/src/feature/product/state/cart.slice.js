import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: {},
        loading: false,
        error: null,
        cartProducts: [],
        socketId:null,
        discountCoupon:null
    },
    reducers: {
        setCart: (state, action) => { state.cart = action.payload },
        setLoading: (state, action) => { state.loading = action.payload },
        setError: (state, action) => { state.error = action.payload },
        setCartProducts: (state, action) => { state.cartProducts = action.payload },
        setSocketId:(state,action)=> {state.socketId = action.payload},
        setDiscountCoupon:(state,action)=> {state.discountCoupon = action.payload},

        // Surgically update only one item's quantity — no full re-render
        updateItemQuantity: (state, action) => {
            const { itemId, quantity } = action.payload;
            const cart = Array.isArray(state.cartProducts)
                ? state.cartProducts[0]
                : state.cartProducts;
            if (!cart?.items) return;
            const item = cart.items.find(i => i._id === itemId);
            if (item) item.quantity = quantity;
        }
    }
});

export default cartSlice.reducer;
export const { setCart, setLoading, setError,setDiscountCoupon, setSocketId, setCartProducts, updateItemQuantity } = cartSlice.actions;