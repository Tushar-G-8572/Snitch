import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockInProduct } from "../dao/product.dao.js";
import mongoose from "mongoose";
import { getCartDetail } from "../dao/cart.dao.js";
import { createOrder } from "../services/payment/payment.service.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import paymentModel from "../models/payment.model.js";
import { config } from "../config/config.js";


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

export async function createOrderController(req,res) {
    const cart = await getCartDetail(req.user.id);
    if(!cart){
        return res.status(404).json({success:false,message:"Cart is empty"})
    }   
    // console.log(cart);
    const order = await createOrder({amount:cart.total, currency:cart.items[0].price.currency});

    const payment = await paymentModel.create({
        user:req.user?.id,
        razorPay:{
            orderId:order.id
        },
        price:{
            amount:cart.total,
            currency:cart.items[0].price.currency
        },
        orderItems:cart.items.map(item => ({
            title:item.product.title,
            productId:item.product._id,
            varientId:item.varient,
            quantity:item.quantity,
            description:item.product.description,
            price:{
              amount:item.product.price.amount || item.product.varients.price.amount,
              currency:item.product.price.currency || item.product.varients.price.currency
            },
            images: item.product.images || item.product.varients.images
        }))
    })

    return res.status(200).json({success:true,order})
}

export async function verifyPaymentOrder(req,res) {
    const {razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;
console.log(razorpay_order_id,razorpay_payment_id,razorpay_signature);
    const payment = await paymentModel.findOne({
        "razorPay.orderId":razorpay_order_id,
        status:'pending'
    })

    if(!payment){
        return res.status(404).json({success:false,message:"No payment found"})
    }

    const isPaymentValid = await validatePaymentVerification({
        order_id:razorpay_order_id,
        payment_id:razorpay_payment_id
    },razorpay_signature,config.RAZORPAY_KEY_SECRET)

    if(!isPaymentValid){
        payment.status = 'failed'
        await payment.save();
        return  res.status(400).json({success:false, message:"Payment Varification failed"})
    }

    payment.status = 'paid'
    payment.razorPay.paymentId=razorpay_payment_id;
    payment.razorPay.signature = razorpay_signature;

    await payment.save();

    await cartModel.findOneAndDelete({user:req.user.id});

    return res.status(200).json({success:true,message:"payment done"})


}

export async function handleGetOrders(req,res) {
    try{
        const userId = req.user.id;
        const ordersStatus = await paymentModel.find({user:userId});
        console.log(ordersStatus[0].status);
        if(ordersStatus[0].status === 'paid'){
            const orders = await getCartDetail(userId); 
            return res.status(200).json({success:true,orders})
        }
    }catch(error){
        console.error(error);
        return res.status(400).json({success:false,message:"Error while fetching orders"})
    }
}