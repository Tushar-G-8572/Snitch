import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const paymentSchema = new mongoose.Schema({
 user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
 },
 status:{
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
 },
 price:{
    type: priceSchema,
    required: true
 },
 razorPay:{
  orderId: String,
  paymentId: String,
  signature: String
 },
 orderItems:[
  {
   title: String,
   productId:mongoose.Schema.Types.ObjectId,
   variantId: mongoose.Schema.Types.ObjectId,
   quantity: Number,
   images:[{url: String}],
   desciription: String,
   price: priceSchema
  }
 ]
})

const paymentModel = mongoose.model('payment', paymentSchema);

export default paymentModel;