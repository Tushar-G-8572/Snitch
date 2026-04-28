import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema({
 product:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"product",
  required:true
 },
 user:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"user",
  required:true
 }
});


const wishListModel = mongoose.model('wishlist',wishListSchema);

export default wishListModel;