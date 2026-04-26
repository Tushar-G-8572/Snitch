import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockInProduct } from "../dao/product.dao.js";
import mongoose from "mongoose";


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
        
        // const products = await cartModel.find({user:userId})

        const products = await cartModel.aggregate(  [
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId)
      }
    },
    { $unwind: { path: '$items' } },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'items.product'
      }
    },
    { $unwind: { path: '$items.product' } },
    {
      $set: {
        'items.product.images': {
          $cond: {
            if: {
              $ne: ['$items.productImageId', null]
            },
            then: {
              $filter: {
                input: '$items.product.images',
                as: 'img',
                cond: {
                  $eq: [
                    '$$img._id',
                    '$items.productImageId'
                  ]
                }
              }
            },
            else: []
          }
        }
      }
    },
    {
      $set: {
        'items.product.varients': {
          $cond: {
            if: { $ne: ['$items.varient', null] },
            then: {
              $filter: {
                input: '$items.product.varients',
                as: 'v',
                cond: {
                  $eq: [
                    '$$v._id',
                    '$items.varient'
                  ]
                }
              }
            },
            else: []
          }
        }
      }
    },
    {
      $unwind: {
        path: '$items.product.images',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: '$items.product.varients',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $set: {
        'items.trustedPrice': {
          $cond: {
            if: { $ne: ['$items.varient', null] },
            then: '$items.product.varients.price.amount',
            else: '$items.product.price.amount'
          }
        }
      }
    },
    {
      $group: {
        _id: '$_id',
        user: { $first: '$user' },
        items: { $push: '$items' },
        total: {
          $sum: {
            $multiply: [
              '$items.trustedPrice',
              '$items.quantity'
            ]
          }
        }
      }
    }
  ])

    if(!products){
        return res.status(200).json({success:true,message:"Your cart is empty"})
    }

    return res.status(200).json({success:true,message:"cart Items fetched",cartData:products})
}catch(error){
    console.error(error);
    return res.status(400).json({success:false,message:"error while getting cart elements"})
}
    
}