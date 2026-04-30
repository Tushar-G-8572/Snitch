import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
 name:"product",
 initialState:{
  sellerProducts:[],
  products:[],
  loading:false,
  error:null
 },
 reducers:{
  setSellerProducts:(state,actions)=>{
   state.sellerProducts = actions.payload
  },
  setProducts:(state,actions)=>{
   state.products = actions.payload
  },
  setLoading:(state,actions)=>{
   state.loading = actions.payload
  },
  setError:(state,actions)=>{
   state.error = actions.payload
  }
 }
})

export const {setSellerProducts,setProducts,setError,setLoading} = productSlice.actions;
export default productSlice.reducer;
