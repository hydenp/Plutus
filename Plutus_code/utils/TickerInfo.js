import axios from 'axios';

class Ticker {
  constructor(ticker) {
    this.ticker = ticker;
    this.price = 0.0;
    this.url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${this.ticker}&interval=5min&apikey=${api_key}`;
  }

  getPrice() {
    // axios.get({
    //   url: this.url,
    //   json: true,
    //   headers: {'User-Agent': 'request'}
    // }, (err, res, data) => {
    //   if (err) {
    //     console.log('Error:', err);
    //   } else if (res.statusCode !== 200) {
    //     console.log('Status:', res.statusCode);
    //   } else {
    //     // data is successfully parsed as a JSON object:
    //     console.log(data);
    //   }
    // });
  }
}
