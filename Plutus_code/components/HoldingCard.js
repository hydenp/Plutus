import React, {useState, useEffect} from 'react';

import {StyleSheet, View, Text} from 'react-native';
import formatter from '../utils/NumberFormatter';

const HoldingCard = prop => {
  const [price, setPrice] = useState(prop.data.currPrice);
  const [shares, setShares] = useState(prop.data.numShare);

  useEffect(() => {
    setPrice(prop.data.currPrice);
    setShares(prop.data.numShare);
  }, [prop.data.currPrice, prop.data.numShare]);

  return (
    <View style={styles.container}>
      <Text style={styles.holdingFont}>{prop.data.ticker}</Text>
      <Text style={styles.holdingFont}>{shares}</Text>
      <Text style={styles.holdingFont}>{formatter.format(price)}</Text>
    </View>
  );
};

export default HoldingCard;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    height: 50,
    backgroundColor: '#C4C4C4',
    borderRadius: 8,
  },
  holdingFont: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
