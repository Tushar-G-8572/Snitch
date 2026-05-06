import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router';
import Loader from '../../shared/components/Loader';

const Protected = ({children, role='Buyer'}) => {

 const user = useSelector(state => state.auth.user);
 const loading = useSelector(state => state.auth.loading);
 const authChecked = useSelector(state => state.auth.isAuthChecked)

 if(!authChecked){
  return <Loader />;
 }

 if(loading){
  return (
   <Loader />
  )
 }


 if(!user){
  return <Navigate to='/login' />
 }

 if(user.role !== role){
 return <Navigate to='/' />
 }
  return children
}

export default Protected