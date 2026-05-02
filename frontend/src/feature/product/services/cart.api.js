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

export const createOrder = async()=>{
    const response = await api.post('/payment/create/order')
    return response.data
}

export const varifyPaymentOrder = async({razorpay_order_id,razorpay_payment_id,razorpay_signature})=>{
    const response = await api.post('/payment/varify/order',{
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    })
    return response.data
}

export const getOrdersDetails = async()=>{
    const response = await api.get('/order');
    return response.data
}

export const getDiscount = async(socketId,discountCoupon)=>{
    console.log(socketId,discountCoupon)
    const response = await api.post('/discount',{socketId,discountCoupon})
    console.log(response.data);
    console.log(response.data.cartDiscountedPrice)
    return response.data;
}