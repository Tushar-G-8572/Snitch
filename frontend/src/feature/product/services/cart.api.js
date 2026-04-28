import axios from "axios";

const api = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
});

export const addToCartApi = async (payload) => {
    const response = await api.post(`/add/${payload.productId}`, payload);
    console.log("addToCartResponse", response.data);
    return response.data;
}

export const getAddToCartProducts = async () => {
    const response = await api.get('/');
    console.log("getAddToCart", response.data);
    return response.data;
}

export const removeAddToCartProduct = async(itemId)=>{
    const response = await api.delete(`/item/${itemId}`);
    return response.data;
}

export const updateCartQuantity = async(itemId,quantity)=>{
    console.log("api",quantity)
    const response = await api.patch(`/item/${itemId}`,{quantity});
    console.log(response.data);
    return response.data;
}