import axios from "axios";

const api = axios.create({
    baseURL:"/api/cart",
    withCredentials:true
});

export const addToCartApi = async(payload)=>{
    const response = await api.post(`/add/${payload.productId}`,payload);
    return response.data;
}   

export const getAddToCartProducts = async()=>{
    const response = await api.get('/');
    // console.log("response",response.data);
    return response.data;
}