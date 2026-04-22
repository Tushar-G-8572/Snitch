import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router';

const Protected = ({children, role='Buyer'}) => {

 const user = useSelector(state => state.auth.user);
 const loading = useSelector(state => state.auth.loading);
 const authChecked = useSelector(state => state.auth.isAuthChecked)

 if(!authChecked){
  return <h1>Checking authentication...</h1>;
 }

 if(loading){
  return (
   <h1>Loading....</h1>
  )
 }

//  console.log(user);
//  console.log(role)

 if(!user){
  return <Navigate to='/login' />
 }

 if(user.role !== role){
 return <Navigate to='/' />
 }
  return children
}

export default Protected