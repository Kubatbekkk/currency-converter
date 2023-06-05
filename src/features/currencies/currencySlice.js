import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { extractCurrencyNames } from '../../lib/extractCurrencyNames';
import { fetchCurrencyData } from '../api/fetchCurrencyData';

const initialState = {
  currencyPairs: [],
  currencyPair: {
    base: 'EUR',
    quote: 'USD',
  },
  currencyNames: [],
  filteredCurrencyNames: [],
  searchQuery: '',
  convertedAmount: 0,
  baseAmount: 1,
  rubValue: 1,
  rubNominal: 1,
  status: 'idle',
  error: null,
};

export const fetchCurrencies = createAsyncThunk(
  'currencies/fetchCurrencies',
  fetchCurrencyData
);

export const convertCurrency = createAsyncThunk(
  'currencies/convertCurrency',
  async (_, { getState }) => {
    const { currencyPair, currencyPairs, baseAmount, rubNominal } =
      getState().currencies;
    const fromCurrency = currencyPair.base;
    const toCurrency = currencyPair.quote;

    if (!currencyPairs || currencyPairs.length === 0) {
      throw Error('Currency pairs not loaded');
    }

    const fromCurrencyPair = currencyPairs.find(
      (currency) => currency.CharCode === fromCurrency
    );

    const toCurrencyPair = currencyPairs.find(
      (currency) => currency.CharCode === toCurrency
    );

    if (!fromCurrencyPair || !toCurrencyPair) {
      throw Error('Currency pair not found');
    }

    const fromValue = fromCurrencyPair.Value;
    const fromNominal = fromCurrencyPair.Nominal;
    const toValue = toCurrencyPair.Value;
    const toNominal = toCurrencyPair.Nominal;

    const rubValue = (baseAmount / fromNominal) * (fromValue / rubNominal);
    const convertedValue = (rubValue / rubNominal) * (toNominal / toValue);

    return convertedValue.toFixed(6);
  }
);

//? slice для загрузки данных с Api
const currencySlice = createSlice({
  name: 'currencies',
  initialState,
  reducers: {
    setCurrencyPairBase: (state, action) => {
      state.currencyPair.base = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredCurrencyNames = state.currencyNames.filter((currencyCode) =>
        state.currencyPairs
          .find((currency) => currency.CharCode === currencyCode)
          .CharCode.toLowerCase()
          .includes(action.payload.toLowerCase())
      );
    },
    setSelectedQuote: (state, action) => {
      state.currencyPair.quote = action.payload;
    },
    findCurrencyPairBase: (state, action) => {
      const selectedCurrency = state.currencyPairs.find(
        (currencyPair) => currencyPair.CharCode === state.currencyPair.base
      );
      const convertedResult = +(
        selectedCurrency.Value * state.baseAmount
      ).toFixed(2);
      state.convertedAmount = convertedResult;
    },
    findCurrencyPairQuote: (state, action) => {
      const selectedCurrency = state.currencyPairs.find(
        (currencyPair) => currencyPair.CharCode === state.currencyPair.quote
      );
      const convertedResult = +(
        selectedCurrency.Value * state.baseAmount
      ).toFixed(2);
      state.convertedAmount = convertedResult;
    },
    setBaseAmount: (state, action) => {
      state.baseAmount = action.payload !== '' ? +action.payload : '';
    },
    swapCurrencies: (state, action) => {
      [state.currencyPair.base, state.currencyPair.quote] = [
        state.currencyPair.quote,
        state.currencyPair.base,
      ];
    },
  },
  //? extraReducers для составления state.currencyPairs
  extraReducers(builder) {
    builder
      .addCase(fetchCurrencies.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const loadedCurrencies = Object.values(action.payload.Valute);
        state.currencyPairs = loadedCurrencies;
        state.currencyNames = extractCurrencyNames(loadedCurrencies);
      })
      .addCase(fetchCurrencies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(convertCurrency.fulfilled, (state, action) => {
        state.convertedAmount = action.payload;
      })
      .addCase(convertCurrency.rejected, (state, action) => {
        console.error(action.error.message);
      });
  },
});
//? selectors
export const selectAllCurrencies = (state) => state.currencies.currencyPairs;
export const getCurrencyStatus = (state) => state.currencies.status;
export const getCurrencyError = (state) => state.currencies.error;
// export const getCurrencyPair = (state) => state.currencies.currencyPair; //? пока не было использовано
export const getSelectedBase = (state) => state.currencies.currencyPair.base;
export const getSelectedQuote = (state) => state.currencies.currencyPair.quote;
export const getBaseAmount = (state) => state.currencies.baseAmount;
export const getCurrencyNames = (state) => state.currencies.currencyNames;
export const getConvertedAmount = (state) => state.currencies.convertedAmount;
export const getFilteredCurrencyNames = (state) =>
  state.currencies.filteredCurrencyNames;
export const getSearchQuery = (state) => state.currencies.searchQuery;

//? actions
export const {
  setCurrencyPairBase,
  setSelectedQuote,
  swapCurrencies,
  setBaseAmount,
  setSearchQuery,
} = currencySlice.actions;

//? reducer
export default currencySlice.reducer;
