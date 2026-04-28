import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockInProduct } from "../dao/product.dao.js";
import mongoose from "mongoose";
import { getCartDetail } from "../dao/cart.dao.js";


export async function addToCart(req, res) {
    const userId = req.user?.id;
    const { productId } = req.params;
    const { variantId, quantity,imageUrl } = req.body;

    let product;
    let imageId;
    if (variantId) {
        product = await productModel.findOne({
            _id: productId,
            "varients._id": variantId
        });
    } else {
        product = await productModel.findOne({ _id: productId });
        imageId = await product.images.find(img => img.url === imageUrl)?._id
    }

    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        });
    }


    const stock = await stockInProduct(productId, variantId);

    const cart =
        (await cartModel.findOne({ user: userId })) ||
        (await cartModel.create({ user: userId }));

    const isProductAlreadyInCart = cart.items.some(
        item =>
            item.product.toString() === productId &&
            item.varient?.toString() === (variantId ?? null)
    );

    if (isProductAlreadyInCart) {
        const cartItem = cart.items.find(
            item =>
                item.product.toString() === productId &&
                item.varient?.toString() === (variantId ?? null)
        );

        const quantityInCart = cartItem.quantity;

        if (quantityInCart + quantity > stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${stock} items left in stock. You already have ${quantityInCart} in your cart`,
            });
        }

        if (variantId) {
            await cartModel.findOneAndUpdate(
                { user: userId, "items.product": productId, "items.varient": variantId },
                { $inc: { "items.$.quantity": quantity } },
                { new: true }
            );
        } else {
            await cartModel.findOneAndUpdate(
                { user: userId, "items.product": productId },
                { $inc: { "items.$.quantity": quantity } },
                { new: true }
            );
        }

        return res.status(200).json({ success: true, message: "Cart Updated Successfully" });
    }

    if (quantity > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock`,
            success: false
        });
    }

    cart.items.push({
        product: productId,
        varient: variantId,
        quantity,
        productImageId: imageId || null,
        price: variantId
            ? (product.varients.find(v => v._id.toString() === variantId)?.price || 0)
            : product.price
    });

    await cart.save();

    return res.status(200).json({
        message: "Product added to cart successfully",
        success: true
    });
}

export async function getAddToCartProduct(req,res) {
    try{

        const userId = req.user?.id        
        const products = await getCartDetail(userId);

    if(!products){
        return res.status(200).json({success:true,message:"Your cart is empty"})
    }

    return res.status(200).json({success:true,message:"cart Items fetched",cartData:products})
}catch(error){
    console.error(error);
    return res.status(400).json({success:false,message:"error while getting cart elements"})
}
    
}

export async function removeAddToCartProduct(req,res) {
  try{

    const {itemId} = req.params;
    const userId = req.user.id
    
  if(!itemId) return res.status(400).json({success:false,message:"Item Id requires"});
  console.log(itemId);

  const cart = await cartModel.findOne({user:userId})

  const safeItems = cart.items.filter(item => item._id.toString() !== itemId);
  cart.items = safeItems;
  await cart.save();

  res.status(200).json({success:true,message:"Cart item removed",cart})
  
}catch(error){
  console.log(error);
  return res.status(400).json({success:false,message:"Error while removing item"})
}



}

export async function updateCartProductQuantity(req,res) {
  try{

    const {itemId} = req.params;
    const userId = req.user.id;
    const {quantity}  = req.body;

    console.log(itemId,userId,quantity)
    
    const cart = await cartModel.findOne({user:userId});

    if(!cart){
    return res.status(404).json({success:false,message:"No product in Cart"})
  }

  cart.items = cart.items.map((item)=>{
      if(item._id.toString() === itemId){
        console.log("In If",item.quantity);
        item.quantity = quantity
      }
      return item
    })

    await cart.save();

    return res.status(200).json({success:true,message:"Cart updated",cartData: cart.items})
}catch(error){
  console.error(error);
  return res.status(400).json({success:false,message:"Error while updating cartProducts"});
}

}