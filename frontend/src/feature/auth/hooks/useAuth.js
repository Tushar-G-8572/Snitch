import { useDispatch } from "react-redux";
import { login,register,getMe } from "../services/authService";
import { setUser,setError,setLoading } from "../state/authSlice";

export const useAuth = ()=>{
  const dispatch = useDispatch();

  async function handleLogin(email,password) {
    try{
      dispatch(setLoading(true));
      const user = await login(email,password);
      dispatch(setUser(user));
      return true;
    }catch(error){
      dispatch(setError(error?.response?.data?.message || error?.message || 'Login failed'));
      return false;
    }finally{
      dispatch(setLoading(false));
    }
  }

  async function handleRegister(fullName,username,email,password,role) {
    try{
      dispatch(setLoading(true));
      const user = await register(email,password,username,fullName,role);
      dispatch(setUser(user));
      return true
    }catch(error){
      dispatch(setError(error?.response?.data?.message || error?.message || 'Registration failed'));
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
