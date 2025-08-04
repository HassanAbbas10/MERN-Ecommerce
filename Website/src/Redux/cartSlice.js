import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart:[]
  
 
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cart.find(item => item._id === action.payload._id);
      if (existingItem) {
        // If item exists, increment quantity instead of adding duplicate
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        // Add new item with quantity 1
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    remFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item._id !== action.payload._id);
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addToCart, remFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
