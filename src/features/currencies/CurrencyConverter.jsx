import { useDispatch, useSelector } from 'react-redux';
import {
  getSelectedQuote,
  setCurrencyPairBase,
  setSelectedQuote,
  getBaseAmount,
  setBaseAmount,
  getCurrencyNames,
  getConvertedAmount,
  getSelectedBase,
  swapCurrencies,
  convertCurrency,
  getCurrencyStatus,
} from './currencySlice';
import changeIcon from '../../assets/icons/change-icon.svg';

const CurrencyConverter = () => {
  const dispatch = useDispatch();
  const selectedBase = useSelector(getSelectedBase);
  const selectedQuote = useSelector(getSelectedQuote);
  const baseAmount = useSelector(getBaseAmount);
  const availableCurrencies = useSelector(getCurrencyNames);
  const convertedAmount = useSelector(getConvertedAmount);
  const currencyStatus = useSelector(getCurrencyStatus);

  const handleCurrencyBaseChange = (e) => {
    const newBase = e.target.value;
    dispatch(setCurrencyPairBase(newBase));
    if (currencyStatus === 'succeeded') {
      dispatch(convertCurrency());
    }
  };

  const handleCurrencyQuoteChange = (e) => {
    const newQuote = e.target.value;
    dispatch(setSelectedQuote(newQuote));
    if (currencyStatus === 'succeeded') {
      dispatch(convertCurrency());
    }
  };

  const handleBaseAmountChange = (e) => {
    const inputAmount = e.target.value;
    const newBaseAmount = inputAmount !== '' ? +inputAmount : '';
    dispatch(setBaseAmount(newBaseAmount));
    if (currencyStatus === 'succeeded') {
      dispatch(convertCurrency());
    }
  };

  const handleSwapCurrencies = () => {
    dispatch(swapCurrencies());
    dispatch(convertCurrency());
  };

  return (
    <div className="converter">
      <h2>Конвертер</h2>
      <div className="converter__wrapper">
        <div className="converter__base-cur">
          <input
            type="text"
            className="converter__input"
            value={baseAmount}
            onChange={handleBaseAmountChange}
          />
          <select
            name="base-cur"
            value={selectedBase}
            onChange={handleCurrencyBaseChange}
            className="converter__cur-select"
          >
            {availableCurrencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className="converter__change-cur">
          <button className="converter__btn" onClick={handleSwapCurrencies}>
            <img src={changeIcon} alt="change-arrow" width="50" height="50" />
          </button>
        </div>
        <div className="converter__info">
          <div className="converter__info-wrapper">
            <p className="converter__info-heading">Результат</p>
            <select
              name="base-cur"
              value={selectedQuote}
              onChange={handleCurrencyQuoteChange}
              className="converter__cur-select"
            >
              {availableCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
          <div className="converter__result">{convertedAmount}</div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
