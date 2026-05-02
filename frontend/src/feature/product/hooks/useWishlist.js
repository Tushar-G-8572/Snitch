import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, getWishListProduct } from "../services/product.api";
import { setProducts, setLoading, setError, toggleWishlistItem } from "../state/wishlist.slice";

export const useWishlist = () => {
    const dispatch = useDispatch();
    const wishlistProducts = useSelector(state => state.wishlist.products);

    // Derive wishlisted state from Redux — single source of truth
    const isWishlisted = (productId) =>
        wishlistProducts.some(p => p._id === productId || p.product?._id === productId);

    async function handleGetWishlistProduct() {
        try {
            dispatch(setLoading(true));
            const result = await getWishListProduct();
            dispatch(setProducts(result.wishList));
        } catch (error) {
            dispatch(setError(error.response?.message || "Error"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleToggleWishlist(productId) {
        // ✅ 1. Update UI instantly — no setLoading, no re-render of other components
        dispatch(toggleWishlistItem(productId));
        try {
            // ✅ 2. Sync with server in background
            await addToWishlist(productId);
        } catch (error) {
            // ✅ 3. Rollback on failure
            dispatch(toggleWishlistItem(productId));
            dispatch(setError(error.response?.message || "Error"));
        }
    }

    return { handleGetWishlistProduct, handleToggleWishlist, isWishlisted };
};