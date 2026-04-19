import axios from "axios";

const api = axios.create({
 baseURL:'/api/product',
 withCredentials:true
})

export async function createProduct(productData) {
 console.log("productData",productData);
 const response = await api.post('/list-product',productData);
 return response.data
}

export async function getProducts() {
 const response = await api.get('/');
 return response.data
}

export async function getSellerProduct() {
 const response = await api.get('/seller');
 return response.data;
}

export async function getProductfromProductId(productId) {
 const response = await api.get(`/product/${productId}`);
 console.log(response.data)
 return response.data
}