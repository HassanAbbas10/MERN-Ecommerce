import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart:[]
  
 
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cart.push(action.payload);
    },
    remFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload.id);
    },
  },
});

export const { addToCart, remFromCart } = cartSlice.actions;

export default cartSlice.reducer;
