import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name:"cart",
    initialState:{
        cart:{},
        loading:false,
        error:null,
        cartProducts:[],
    },
    reducers:{
        setCart:(state,actions)=>{
            state.cart = actions.payload
        },
        setLoading:(state,actions)=>{
            state.loading = actions.payload
        },
        setError:(state,actions)=>{
            state.error = actions.payload
        },
        setCartProducts:(state,actions)=>{
            state.cartProducts = actions.payload
        }
    }
})

export default cartSlice.reducer;
export const {setCart,setLoading,setError,setCartProducts} = cartSlice.actions;