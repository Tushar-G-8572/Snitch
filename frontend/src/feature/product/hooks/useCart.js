import { useDispatch } from "react-redux";
import { addToCartApi, getAddToCartProducts, removeAddToCartProduct } from "../services/cart.api";
import { setCart, setLoading, setError, setCartProducts } from "../state/cart.slice";

export const useCart = () => {
    const dispatch = useDispatch();
    async function handleAddToCart(payload) {
        try {
            dispatch(setLoading(true));
            const result = await addToCartApi(payload);
            dispatch(setCart(result.cartItem))
            // return result;
        } catch (error) {
            console.error(error);
            dispatch(setError(
                error?.response?.data?.message || error?.message || "Error"
            ));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetAddToCartProduct() {
        try {
            dispatch(setLoading(true));
            const result = await getAddToCartProducts();
            // console.log("Result",result.cartItems);
            dispatch(setCartProducts(result.cartData));
        } catch (error) {
            console.error(error);
            dispatch(setError(error?.response?.data?.message || error?.message || "Error"))
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleRemoveAddToCart(itemId) {
        try{
            dispatch(setLoading(true));
            const result = await removeAddToCartProduct(itemId);
            dispatch(setCartProducts(result.cart))
        }catch(error){
            console.error(error);
            dispatch(setError(error?.response?.data?.message || error?.message || "Error"))
        }finally{
            dispatch(setLoading(false));
        }
    }

    return { handleAddToCart, handleGetAddToCartProduct ,handleRemoveAddToCart }
}