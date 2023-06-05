import React, { useEffect } from 'react';
import './style.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCurrencies,
  getCurrencyStatus,
  getCurrencyError,
  convertCurrency,
  selectAllCurrencies,
} from './features/currencies/currencySlice';
import CurrencyList from './features/currencies/CurrencyList';
import CurrencyConverter from './features/currencies/CurrencyConverter';

export default function App() {
  const dispatch = useDispatch();
  const currencyStatus = useSelector(getCurrencyStatus);
  const currencies = useSelector(selectAllCurrencies);
  const error = useSelector(getCurrencyError);

  useEffect(() => {
    if (currencyStatus === 'idle') {
      dispatch(fetchCurrencies());
    } else if (currencyStatus === 'succeeded' && currencies.length > 0) {
      dispatch(convertCurrency());
    }
  }, [currencyStatus, dispatch]);

  let content;
  if (currencyStatus === 'loading') {
    content = <p>Loading...</p>;
  } else if (currencyStatus === 'succeeded') {
    content = (
      <>
        <div>
          <CurrencyList />
        </div>
        <CurrencyConverter />
      </>
    );
  } else if (currencyStatus === 'failed') {
    content = <p>{error}</p>;
  }

  return <main>{content}</main>;
}
