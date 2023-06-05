export const extractCurrencyNames = (loadedCurrencies) => {
  const currencyNames = loadedCurrencies.map((currency) => currency.CharCode);
  return currencyNames;
};
