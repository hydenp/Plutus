import React from 'react';

import {StyleSheet, View, Text} from 'react-native';

const HoldingCard = ({price}) => {
  return (
    <View style={styles.container}>
      <Text>Ticker Symbol</Text>
      <Text>${price}</Text>
    </View>
  );
};

export default HoldingCard;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 50,
    color: 'white',
    backgroundColor: 'grey',
    borderRadius: 5,
  },
});
