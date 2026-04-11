import { useDispatch } from "react-redux";
import { login,register,getMe } from "../services/authService";
import { setUser,setError,setLoading } from "../state/authSlice";

export const useAuth = ()=>{
  const dispatch = useDispatch();

  async function handleLogin(email,password) {
    try{
      dispatch(setLoading(true));
      const user = await login(email,password);
      return true;
      dispatch(setUser(user));
    }catch(error){
      dispatch(setError(error));
      return false;
    }finally{
      dispatch(setLoading(false));
    }
  }

  async function handleRegister(email,password,fullName,username,role) {
    try{
      dispatch(setLoading(true));
      const user = await register(email,password,username,role,fullName);
      return true
      dispatch(setUser(user));
    }catch(error){
      dispatch(setError(error));
      return false
    }finally{
      dispatch(setLoading(false));
    }
  }
  return {
    handleLogin,
    handleRegister
  }
}
