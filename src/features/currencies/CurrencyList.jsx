import React from 'react';
import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllCurrencies,
  getCurrencyNames,
  getFilteredCurrencyNames,
  setCurrencyPairBase,
  convertCurrency,
  setSearchQuery,
  getSearchQuery,
} from './currencySlice';
import debounce from 'lodash/debounce';
import upIcon from '../../assets/icons/up-icon.svg';
import downIcon from '../../assets/icons/down-icon.svg';

const CurrencyList = () => {
  const currencies = useSelector(selectAllCurrencies);
  const currencyNames = useSelector(getCurrencyNames);
  const filteredCurrencyNames = useSelector(getFilteredCurrencyNames);
  const dispatch = useDispatch();
  const searchQuery = useSelector(getSearchQuery);

  const handleCurrencyPairBase = (newBase) => {
    dispatch(setCurrencyPairBase(newBase));
    dispatch(convertCurrency());
  };

  const handleSearchQuery = (event) => {
    debounce(() => {
      dispatch(setSearchQuery(event.target.value));
    }, 5_00)();
  };

  const displayCurrencyNames =
    searchQuery.length > 0 ? filteredCurrencyNames : currencyNames;

  return (
    <div className="currency">
      <h2>Список доступных валют</h2>
      <input
        type="text"
        placeholder="Поиск по коду"
        className="currency__search"
        onChange={handleSearchQuery}
      />
      {displayCurrencyNames.length > 0 ? (
        displayCurrencyNames.map((currencyCode) => {
          const currency = currencies.find((c) => c.CharCode === currencyCode);
          return (
            <Fragment key={currency.ID}>
              <div
                role="button"
                tabIndex={0}
                className="currency__info"
                onClick={() => handleCurrencyPairBase(currency.CharCode)}
              >
                <span className="currency__code">{currency.CharCode}</span>
                <span className="currency__name">{currency.Name}</span>
                <div className="currency__value">
                  <span>{currency.Value.toFixed(2)}</span>
                  <span>₽</span>
                </div>
                <img
                  src={currency.Value > currency.Previous ? upIcon : downIcon}
                  width="25"
                  height="25"
                />
              </div>
            </Fragment>
          );
        })
      ) : (
        <div className="currency__not-found">Currency not found</div>
      )}
    </div>
  );
};

export default CurrencyList;
