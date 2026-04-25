import React, { useEffect } from 'react'
import { useCart } from '../hooks/useCart';
import { useSelector } from 'react-redux';

const AddToCartPage = () => {
  useEffect(()=>{
    handleGetAddToCartProduct()
  },[])
  const {handleGetAddToCartProduct} = useCart()
  const cartProducts = useSelector(state => state.cart.cartProducts);
  console.log(cartProducts);
  return (
    <div>AddToCartPage</div>
  )
}

export default AddToCartPage