import axios from 'axios';
import {FINNHUB_API_KEY} from '@env';

class TickerInfo {
  static async getData(symbol) {
    const api_key = FINNHUB_API_KEY;
    return axios({
      method: 'get',
      url: `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${api_key}`,
    });
  }
}

export default TickerInfo;
