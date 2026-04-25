import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockInProduct } from "../dao/product.dao.js";


export async function addToCart(req,res) {
    const userId = req.user?.id;
    const {productId} = req.params;
    const {variantId,quantity} = req.body;

    let product;

    if(variantId){
        product = await productModel.findOne({
            _id:productId,
            "varients._id":variantId
        })
    }else{
        product = await productModel.findOne({_id:productId});
    }

    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        })
    }

    const stock = await stockInProduct(productId,variantId);
    
    const cart = (await cartModel.findOne({user:userId})) || (await cartModel.create({user:userId}));

    const isProductAlreadyInCart = cart.items.some(item => item.product.toString() === productId && item.varient?.toString() === variantId);

    if(isProductAlreadyInCart){
        const quantityInCart = cart.items.find(item => item.product.toString() === productId && item.varient?._id.toString() === variantId).quantity
        if(quantityInCart + quantity > stock){
            return res.status(400).json({success:false, message: `Only ${stock} items left in stock. and you already have ${quantityInCart} items in your cart`,})
        }
        
        if(variantId){
            await cartModel.findOneAndUpdate({user:userId,"items.product":productId,"items.varient":variantId},
                { $inc: {"items.$.quantity":quantity}},
                {new:true},
            )
        }else{
            await cartModel.findOneAndUpdate({user:userId,"items.product":productId},
                { $inc: {"items.$.quantity":quantity}},{new:true})
            }
            
            return res.status(200).json({success:true,message:"Cart Updated Successfully"})
        }

        if(quantity > stock){
            return res.status(400).json({
            message: `Only ${stock} items left in stock`,
            success: false
        })
        }

        cart.items.push({
        product: productId,
        variant: variantId,
        quantity,
        price: (variantId)
                ? (product.varients.find(v => v._id.toString() === variantId)?.price || 0) 
                : product.price
    })

    await cart.save()

    return res.status(200).json({
        message: "Product added to cart successfully",
        success: true
    })    
}

export async function getAddToCartProduct(req,res) {
    try{

        const userId = req.user?.id
        
        const products = await cartModel.find({user:userId});

    if(!products){
        return res.status(200).json({success:true,message:"Your cart is empty"})
    }

    return res.status(200).json({success:true,message:"cart Items fetched",cartData:products})
}catch(error){
    console.error(error);
    return res.status(400).json({success:false,message:"error while getting cart elements"})
}
    
}