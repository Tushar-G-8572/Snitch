import axios from "axios";

const api = axios.create({
    baseURL: '/api/product',
    withCredentials: true
})

export async function createProduct(productData) {
    //  console.log("productData",productData);
    const response = await api.post('/list-product', productData);
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
    //  console.log(response.data)
    return response.data
}

export async function editProduct(productId, productData) {
    console.log(productData);
    const response = await api.post(`/seller/product/${productId}`, productData, {
        headers: {
            "Content-Type": undefined
        }
    });
    console.log("edit Response", response.data);
    return response.data;
}

export async function editProductVariants(productId, variantData) {
    const response = await api.put(`/seller/product/${productId}/variants`, variantData, {
        headers: { 'Content-Type': undefined },
    });
    return response.data;
}