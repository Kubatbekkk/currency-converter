import axios from 'axios';

const fetchCurrencyData = async () => {
  try {
    const response = await axios.get(
      'https://www.cbr-xml-daily.ru/daily_json.js'
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.log('Error fetching currency data:', error);
    throw new Error('Failed to fetch currency data');
  }
};

export default fetchCurrencyData;
