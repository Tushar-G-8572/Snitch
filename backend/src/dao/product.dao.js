import productModel from "../models/product.model.js";

export const stockInProduct = async (productId,variantId)=>{
 let product;
 if(variantId){
  product = await productModel.findOne({
  _id:productId,
  "varients._id":variantId
 })
 }else{
  product = await productModel.findOne({_id:productId})
 }
 const stock = (variantId) ? 
               product.varients.find(varient => varient._id.toString() === variantId).stock
               :(product._id.toString()=== productId).stock;

 return stock;
}