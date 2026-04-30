import mongoose from 'mongoose';

const aiNegotiationSchema = new mongoose.Schema({
  user:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"user",
   required:true
  },
  cart:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"cart",
   required:true
  },
  totalAmount:{
   type:Number,
   required:true
  },
  negotiableAmount:{
   type:Number,
   required:true
  },
  paymentId:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"payment"
  }
 },{
  timestamps:true
 }
);

const aiNegotiationModel = mongoose.model('aiNegotiation', aiNegotiationSchema);

export default aiNegotiationModel;