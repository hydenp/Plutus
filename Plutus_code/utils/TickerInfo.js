import axios from 'axios';

class TickerInfo {
  constructor(symbol) {
    this.symbol = symbol;
    this.data = null;
    this.api_key = 'c6dj5gaad3ibd9kajrlg';
    this.url = `https://finnhub.io/api/v1/quote?symbol=${this.symbol}&token=${this.api_key}`;
  }

  getData() {
    return axios({
      method: 'get',
      url: this.url,
    });
  }

  async do() {
    const res = await this.getData();
    this.data = res.data;
  }
}

export default TickerInfo;
