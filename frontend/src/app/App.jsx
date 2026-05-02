import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { useAuth } from "../feature/auth/hooks/useAuth.js"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { setSocketId } from "../feature/product/state/cart.slice.js"
import { useDispatch } from "react-redux"
import socket from "../feature/product/utils/socket.service.js"


const App = ()=>{
  const {handleGetMe} = useAuth()
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  useEffect(()=>{
     handleGetMe()
  }, [])

  useEffect(()=>{
    socket.on('connect', () => {
      dispatch(setSocketId(socket.id));
    });

    return () => socket.off('connect');
  },[dispatch])

  return (
    <RouterProvider router={router} />
  )
}

export default App