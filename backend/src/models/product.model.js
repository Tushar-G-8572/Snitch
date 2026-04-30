import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

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
  type:priceSchema,
  required:true
 },
 stock:{
  type:Number,
  default:0
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
    type:priceSchema
   }
  }
 ]
}, {
 timestamps: true
})


const productModel = mongoose.model('product', productSchema)
export default productModel;