import { useDispatch } from "react-redux";
import { addToCartApi, getAddToCartProducts, removeAddToCartProduct, updateCartQuantity } from "../services/cart.api";
import { setCart, setLoading, setError, setCartProducts, updateItemQuantity } from "../state/cart.slice";

export const useCart = () => {
    const dispatch = useDispatch();

    async function handleAddToCart(payload) {
        try {
            dispatch(setLoading(true));
            const result = await addToCartApi(payload);
            dispatch(setCart(result.cartItem));
            return true;
        } catch (error) {
            dispatch(setError(error?.response?.data?.message || error?.message || "Error"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetAddToCartProduct() {
        try {
            dispatch(setLoading(true));
            const result = await getAddToCartProducts();
            dispatch(setCartProducts(result.cartData));
        } catch (error) {
            dispatch(setError(error?.response?.data?.message || error?.message || "Error"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleRemoveAddToCart(itemId) {
        try {
            dispatch(setLoading(true));
            const result = await removeAddToCartProduct(itemId);
            dispatch(setCartProducts(result.cart));
        } catch (error) {
            dispatch(setError(error?.response?.data?.message || error?.message || "Error"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleUpdateQuantity(itemId, quantity) {
        // Optimistic update — no loading dispatch, no full re-render
        dispatch(updateItemQuantity({ itemId, quantity }));
        try {
            await updateCartQuantity(itemId, quantity);
        } catch (error) {
            // Rollback on failure
            dispatch(updateItemQuantity({ itemId, quantity: quantity > 1 ? quantity - 1 : quantity + 1 }));
            dispatch(setError(error?.response?.data?.message || error?.message || "Error"));
        }
    }

    return { handleAddToCart, handleGetAddToCartProduct, handleRemoveAddToCart, handleUpdateQuantity };
};