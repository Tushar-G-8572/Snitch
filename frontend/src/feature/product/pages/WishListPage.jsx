import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useProducts } from '../hooks/useProducts'

const WishListPage = () => {
    const products  = useSelector(state => state.product.products) || []

    const {handleGetWishlistProduct} = useProducts()

    useEffect(()=>{
        handleGetWishlistProduct();
    },[])
    console.log("Wish list",products);
  return (
    <div>WishListPage</div>
  )
}

export default WishListPage