import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import TickerInfo from '../utils/TickerInfo';

const HoldingCard = ({holding, ticker, numShares}) => {
  const [price, setPrice] = useState('-.--');

  async function updatePrice() {
    var x = new TickerInfo(ticker);
    await x.do();
    setPrice(x.data.c);
  }

  useEffect(() => {
    updatePrice();
  });

  return (
    <View style={styles.container}>
      <Text>{ticker}</Text>
      <Text>{numShares}</Text>
      <Text>${price}</Text>
    </View>
  );
};

export default HoldingCard;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    height: 50,
    color: 'white',
    backgroundColor: 'grey',
    borderRadius: 5,
  },
});
