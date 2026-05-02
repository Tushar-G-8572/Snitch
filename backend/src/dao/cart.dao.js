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
        aiDiscount:{ $first: '$aiDiscount'},
        total: {
          $sum: {
            $multiply: [
              '$items.trustedPrice',
              '$items.quantity'
            ]
          }
        }
        }
      },
      {
      $addFields: {
        discountRate: {
          $switch: {
            branches: [
              { case: { $eq: ['$aiDiscount', 'SNITCH5'] },  then: 0.05 },
              { case: { $eq: ['$aiDiscount', 'SNITCH10'] }, then: 0.10 },
              { case: { $eq: ['$aiDiscount', 'SNITCH15'] }, then: 0.15 },
            ],
            default: 0
          }
        }
      }
    },
    {
      $addFields: {
        discountAmount: {
          $round: [{ $multiply: ['$total', '$discountRate'] }, 2]
        },
        finalTotal: {
          $round: [
            { $multiply: ['$total', { $subtract: [1, '$discountRate'] }] },
            2
          ]
        }
      }
    }
  ]))[0]
  return cart
}