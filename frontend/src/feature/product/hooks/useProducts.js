import { useDispatch } from "react-redux";
import { createProduct , getProductfromProductId, getProducts ,getSellerProduct } from "../services/product.api";
import { setSellerProducts,setProducts,setLoading,setError } from "../state/product.slice";

export const useProducts = ()=>{
 const dispatch = useDispatch();
  async function handleCreateProduct(productData) {
   try{
    dispatch(setLoading(true));
    const result = await createProduct(productData);
    return result.product;
   }catch(error){
    dispatch(setError(error));
    return false;
   }finally{
    dispatch(setLoading(false));
   }
  }
  async function handleGetAllProducts() {
   try{
    dispatch(setLoading(true));
    const result = await getProducts();
    dispatch(setProducts(result.products))
    return result.products
   }catch(error){
    dispatch(setError(error))
   }finally{
    dispatch(setLoading(false));
   }
  }

  async function handleGetSellerProducts() {
    try{
      dispatch(setLoading(true));
      const products = await getSellerProduct();
      dispatch(setSellerProducts(products.products));
    }catch(error){
      console.error(error);
      dispatch(setError(error));
    }finally{
      dispatch(setLoading(false));
    }
  }

  async function handleGetProductFromProductId(productId) {
    try{
      dispatch(setLoading(true));
      const result = await getProductfromProductId(productId);
      dispatch(setProducts(result.products))
    }catch(error){
      console.error(error);
      dispatch(setError(error));
    }finally{
      dispatch(setLoading(false));
    }
  }

  return {handleCreateProduct,handleGetAllProducts , handleGetSellerProducts , handleGetProductFromProductId};

}

