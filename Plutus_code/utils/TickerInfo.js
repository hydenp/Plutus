import axios from 'axios';

class TickerInfo {
  // constructor(symbol) {
  //   this.symbol = symbol;
  //   this.data = null;
  //   this.api_key = 'c6dj5gaad3ibd9kajrlg';
  //   this.url = `https://finnhub.io/api/v1/quote?symbol=${this.symbol}&token=${this.api_key}`;
  // }

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
