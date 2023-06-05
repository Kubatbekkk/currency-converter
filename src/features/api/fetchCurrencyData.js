import axios from 'axios';

const CURRENCY_URL = 'https://www.cbr-xml-daily.ru/daily_json.js';

export const fetchCurrencyData = async () => {
  try {
    const response = await axios.get(CURRENCY_URL);
    return response.data;
  } catch (error) {
    console.log('Error fetching currency data:', error.message);
    throw new Error('Failed to fetch currency data');
  }
};
