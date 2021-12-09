import axios from 'axios';

class TickerInfo {
  static async getData(symbol) {
    let api_key = 'c6m340aad3i9dkni4430';
    return axios({
      method: 'get',
      url: `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${api_key}`,
    });
  }

  static async do(symbol) {
    const res = await this.getData(symbol);
    return res.data;
  }
}

export default TickerInfo;
