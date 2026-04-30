import { useDispatch } from "react-redux";
import { createProduct, editProduct, getProductfromProductId, getProducts, getSellerProduct,editProductVariants, addToWishlist, getWishListProduct } from "../services/product.api";
import { setSellerProducts, setProducts, setLoading, setError } from "../state/product.slice";

export const useProducts = () => {
  const dispatch = useDispatch();
  async function handleCreateProduct(productData) {
    try {
      dispatch(setLoading(true));
      const result = await createProduct(productData);
      return result.product;
    } catch (error) {
      dispatch(setError(
        error?.response?.data?.message || error?.message || "Error"
      ));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function handleGetAllProducts() {
    try {
      dispatch(setLoading(true));
      const result = await getProducts();
      dispatch(setProducts(result.products))
      return result.products
    } catch (error) {
      console.error(error)
      dispatch(setError(
        error?.response?.data?.message || error?.message || "Error"
      ));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetSellerProducts() {
    try {
      dispatch(setLoading(true));
      const products = await getSellerProduct();
      dispatch(setSellerProducts(products.products));
    } catch (error) {
      console.error(error);
      dispatch(setError(
        error?.response?.data?.message || error?.message || "Error"
      ));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetProductFromProductId(productId) {
    try {
      dispatch(setLoading(true));
      const result = await getProductfromProductId(productId);
      dispatch(setProducts(result.products))
    } catch (error) {
      console.error(error);
      dispatch(setError(
        error?.response?.data?.message || error?.message || "Error"
      ));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleEditProduct(productId,data) {
    try {
      dispatch(setLoading(true));
      console.log("productId",productId);
      console.log("productData", data);
      const result = await editProduct(productId,data);
      dispatch(setProducts(result.product))
    } catch (error) {
      console.error(error);
      dispatch(setError(
        error?.response?.data?.message || error?.message || "Error"
      ));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleEditProductVarient(productId,variantData) {
    try{
      dispatch(setLoading(true));
      console.log("Product Id", productId);
      console.log("Product varient detail", variantData);
      const response = await editProductVariants(productId,variantData);
      dispatch(setProducts(response.product));

    }catch(error){
      console.error(error);
      dispatch(setError(error?.response?.data?.message || error?.message || "error in updateVarient"))
    }finally{
      dispatch(setLoading(false));
    }
  }

  async function handleGetWishlistProduct() {
    try{
      dispatch(setLoading(true));
      const result = await getWishListProduct();
      dispatch(setProducts(result.wishList));
    }catch(error){
      console.error(error);
      dispatch(setError(error.response?.message || "Error"));
    }finally{
      dispatch(setLoading(false));
    }
  }

  async function handleAddTowishList(productId) {
    try{

      await addToWishlist(productId);
      return true
    }catch(error){
      console.error(error);
      return false;
    }
  }

  return { 
     handleCreateProduct,
     handleGetAllProducts, 
     handleGetSellerProducts, 
     handleGetProductFromProductId,
     handleEditProduct,
     handleEditProductVarient,
     handleAddTowishList,
     handleGetWishlistProduct
    };

}

