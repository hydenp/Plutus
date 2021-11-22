import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import TickerInfo from '../utils/TickerInfo';

const HoldingCard = ({holding}) => {
  const [price, setPrice] = useState('-.--');

  async function updatePrice() {
    var x = new TickerInfo(holding.symbol);
    await x.do();
    setPrice(x.data.c);
  }

  useEffect(() => {
    updatePrice();
  });

  return (
    <View style={styles.container}>
      <Text>{holding.symbol}</Text>
      <Text>{holding.shares}</Text>
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
