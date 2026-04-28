import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {
        setProducts: (state, action) => { state.products = action.payload },
        setLoading: (state, action) => { state.loading = action.payload },
        setError: (state, action) => { state.error = action.payload },

        // ✅ Surgically toggle one product — no full re-render
        toggleWishlistItem: (state, action) => {
            const productId = action.payload;
            const exists = state.products.find(p => p._id === productId || p.product?._id === productId);
            if (exists) {
                state.products = state.products.filter(
                    p => p._id !== productId && p.product?._id !== productId
                );
            } else {
                // optimistically push a placeholder
                state.products.push({ _id: productId, product: { _id: productId } });
            }
        }
    }
});

export default wishlistSlice.reducer;
export const { setProducts, setLoading, setError, toggleWishlistItem } = wishlistSlice.actions;