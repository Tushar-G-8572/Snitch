import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthChecked:false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser:(state,action)=>{
      state.user = action.payload
    },
    setLoading:(state,action)=>{
      state.loading = action.payload
    },
    setError:(state,action)=>{
      state.error = action.payload
    },
    setAuthChecked:(state,action)=>{
      state.isAuthChecked = action.payload
    }
  },
});

export const { setError,setLoading,setUser,setAuthChecked } = authSlice.actions;
export default authSlice.reducer;
