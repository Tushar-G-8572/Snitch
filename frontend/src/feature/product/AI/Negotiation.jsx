import React, { useEffect } from 'react'
import { useCart } from '../hooks/useCart'
import { useSelector } from 'react-redux'


const Negotiation = () => {
  const {handleGetAddToCartProduct} = useCart()
  const cartProducts = useSelector(state => state.cart.cartProducts)
  useEffect(()=>{
    handleGetAddToCartProduct();
  },[])

  console.log("cartProducts",cartProducts);

  return (
    <div>Negotiation</div>
  )
}

export default Negotiation