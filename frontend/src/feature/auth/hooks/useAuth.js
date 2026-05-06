import { useDispatch } from "react-redux";
import { login, register, getMe, logout, updateUser } from "../services/auth.api";
import { setUser, setError, setLoading, setAuthChecked } from "../state/auth.slice";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleLogin(email, password) {
    try {
      dispatch(setLoading(true));
      const response = await login(email, password);
      dispatch(setUser(response.user));
      return true;
    } catch (error) {
      dispatch(setError(error?.response?.data?.message || error?.message || 'Login failed'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleRegister(fullName, username, email, password, role) {
    try {
      dispatch(setLoading(true));
      const response = await register(email, password, username, fullName, role);
      dispatch(setUser(response.user));
      return true
    } catch (error) {
      dispatch(setError(error?.response?.data?.message || error?.message || 'Registration failed'));
      return false
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const response = await getMe();
      dispatch(setUser(response.user));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
      dispatch(setAuthChecked(true))
    }
  }

  async function handleLogout() {
    await logout();
    dispatch(setUser(null));
  }

  async function handleUpdateUser(fileInputRef) {
    try{
      dispatch(setLoading(true));
      const result = await updateUser(fileInputRef)
      return result.success;
    }catch(error){
      dispatch(setError(error?.message || "Error"))
    }finally{
      dispatch(setLoading(false));
    }
  }

  return {
    handleLogin,
    handleRegister,
    handleGetMe,
    handleLogout,
    handleUpdateUser
  }
}
