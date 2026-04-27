import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

export async function getCartDetail(userId) {
  let cart = (await cartModel.aggregate( [
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
  ]))[0]
  return cart
}