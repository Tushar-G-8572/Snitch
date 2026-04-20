import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
 title: {
  type: String,
 },
 description: {
  type: String,
  required: true
 },
 seller: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'user',
  required: true
 },
 price: {
  amount: {
   type: Number,
   required: true
  },
  currency: {
   type: String,
   enum: ["INR", "USD", "GBP", "JPY", "EUR"],
   default: "INR"
  }
 },
 images: [{
  url: {
   type: String,
   required: true
  },
 }],
 varients: [
  {
   images: [
    {
     url: {
      type: String,
     }
    }
   ],
   stock: {
    type: Number,
    default: 0
   },
   attributes: {
    type: Map,
    of: String
   },
   price: {
    amount: {
     type: Number
    },
    currency: {
     type: String,
     enum: ["INR", "USD", "GBP", "JPY", "EUR"],
     default: "INR"
    }
   }
  }
 ]
}, {
 timestamps: true
})


const productModel = mongoose.model('product', productSchema)
export default productModel;