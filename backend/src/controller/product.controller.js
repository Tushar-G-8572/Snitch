import productModel from "../models/product.model.js";
import { storeImage } from "../services/ImagekitService/storage.service.js";

export async function handleCreateProduct(req,res) {
 try{

  const {id,role} = req.user;
  if(role !== "Seller"){
  return res.status(403).json({success:false,message:"Unauthorised"})
 } 
 const {title,description,priceAmount,priceCurrency} = req.body
 console.log(title,description,priceAmount,priceCurrency)
 const images = await Promise.all(req.files.map(async(file)=>{
   return await storeImage(file)
 }))

 const productData = await productModel.create({
  title,
  description,
  price:{
   amount:Number(priceAmount),
   currency:priceCurrency
  },
  images,
  seller:id
 })

 return res.status(201).json({success:true,message:"Product lists successfully",products:productData})

}catch(error){
 console.log(error);
 return res.status(500).json({success:false,message:"Error while listing Product"})
}

}

export async function handleGetProducts(req,res) {
 
 try{
  const products = await productModel.find().lean()
  if(!products) return res.status(200).json({success:true,message:"Products not listed"})
  return res.status(200).json({success:true,message:"Products fetched",products:products})
 }catch(error){
  console.error(error);
  return res.status(500).json({success:false,message:"Error while getting Products"});
 }

}

export async function handleGetSellerProducts(req,res) {
  try{

    const {id,role} = req.user;
    if(role !== 'Seller'){
      return res.status(403).json({success:false,message:"Unauthorised"});
    }

    const products = await productModel.find({seller:id}).lean();
    if(!products) return res.status(400).json({success:false,message:"No Products Found"});

    return res.status(200).json({success:true,message:"Product fetched",products:products})

  }catch(error){
    console.error(error);
    return res.status(500).json({success:false,message:"Error while getting seller Products"});
  }
}

export async function handleGetRelatedProduct(req,res) {
  try{

    const {productId} = req.params;
    if(!productId){
      return res.status(404).json({success:false,message:"No Products found"});
    }
    const productDetail = await  productModel.findById(productId);
    return res.status(200).json({success:true,message:"Product fetched",products:productDetail})
    }catch(error){
  console.log(error)
  return res.status(400).json({success:false,message:"Error while getting Product"})
}
}