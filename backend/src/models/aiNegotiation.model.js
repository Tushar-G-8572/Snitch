import mongoose from 'mongoose';

const aiNegotiationSchema = new mongoose.Schema({
  user:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"user",
  },
  cart:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"cart",
  },
  totalAmount:{
   type:Number,
  },
  aiDiscountCoupon:{
    type:String,
  },
  paymentId:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"payment"
  },
 },{
  timestamps:true
 }
);

const aiNegotiationModel = mongoose.model('aiNegotiation', aiNegotiationSchema);

export default aiNegotiationModel;