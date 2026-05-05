import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockInProduct } from "../dao/product.dao.js";
import mongoose from "mongoose";
import { getCartDetail } from "../dao/cart.dao.js";
import { createOrder } from "../services/payment/payment.service.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import paymentModel from "../models/payment.model.js";
import { config } from "../config/config.js";
import redis from "../config/cache.config.js";
import aiNegotiationModel from "../models/aiNegotiation.model.js";


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

  const cart = await cartModel.findOne({user:userId})

  const safeItems = cart.items.filter(item => item._id.toString() !== itemId);
  cart.items = safeItems;
  await cart.save();

  res.status(200).json({success:true,message:"Cart item removed",cart})
  
}catch(error){
  console.error(error);
  return res.status(400).json({success:false,message:"Error while removing item"})
}



}

export async function updateCartProductQuantity(req,res) {
  try{

    const {itemId} = req.params;
    const userId = req.user.id;
    const {quantity}  = req.body;

    const cart = await cartModel.findOne({user:userId});

    if(!cart){
    return res.status(404).json({success:false,message:"No product in Cart"})
  }

  cart.items = cart.items.map((item)=>{
      if(item._id.toString() === itemId){
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
    let amoutPay = Math.ceil(cart.finalTotal) ||cart.total
    const order = await createOrder({amount:amoutPay, currency:cart.items[0].price.currency});

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


    const aiPaymentId = await aiNegotiationModel.findOne({user:req.user?.id,cart:cart._id}) 
    || await aiNegotiationModel.create({user:req.user?.id,cart:cart._id})
    
    aiPaymentId.paymentId = payment._id;

    await aiPaymentId.save();


    return res.status(200).json({success:true,order})
}

export async function verifyPaymentOrder(req,res) {
    const {razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;
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
        const orders = await paymentModel.findOne({user:userId});
        if(orders.status === 'paid'){
            return res.status(200).json({success:true,orders})
        }else{
            return res.status(200).json({success:true,message:"No orders now"})
        }
    }catch(error){
        console.error(error);
        return res.status(400).json({success:false,message:"Error while fetching orders"})
    }
}

export async function handleDiscountCoupon(req, res) {
  try {
    const userId = req.user.id;
    // const {cartId} = req.params;
    const { socketId, discountCoupon } = req.body;
    if (!socketId || !discountCoupon) {
      return res.status(400).json({ success: false, message: "socketId and discountCoupon are required" });
    }

    const cart = await cartModel.findOne({user:userId});
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const aiRoundsCompleted = await aiNegotiationModel.findOne({$and:[{user:userId},{cart:cart._id}]});
    if(aiRoundsCompleted){
        return res.status(400).json({success:false,message:"You have already used the negotiation"})
    }


    // 2. Fetch the session from Redis
    const raw = await redis.get(socketId.toString());
    const validCoupon = JSON.parse(raw);
    if (!raw) {
      cart.aiDiscount = null;  
      await cart.save();
      return res.status(400).json({ success: false, message: "Coupon code expired please refresh the page "});
    }


    // 3. Actually compare — this was the missing step
    if (!validCoupon || validCoupon !== discountCoupon) {
      return res.status(400).json({ success: false, message: "Invalid coupon code" });
    }

    cart.aiDiscount = discountCoupon;
    await cart.save();

    const getDiscountedPrice = await getCartDetail(userId);

    await aiNegotiationModel.create({user:userId,cart:cart._id,totalAmount:cart.total,aiDiscountCoupon:cart.aiDiscount})

    return res.status(200).json({ success: true, message: "Coupon applied successfully" ,cartDiscountedPrice:getDiscountedPrice });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}