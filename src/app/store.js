import { configureStore } from '@reduxjs/toolkit';
import currencyReducer from '../features/currencies/currencySlice';

export const store = configureStore({
  reducer: {
    currencies: currencyReducer,
  },
});
