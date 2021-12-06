import React from 'react';

import {StyleSheet, View, Text, SafeAreaView, Flatlist} from 'react-native';
import HoldingCard from './HoldingCard';

const PositionCard = ({holdings, ticker}) => {
  // console.log('PositionCard Holdings: ' + holdings[0].ticker); 
  return (
    <SafeAreaView style={{...styles.container, ...styles.shadow}}>
      <View style={styles.container}>
        <Text>Card Title {ticker}</Text>
        {/* <HoldingCard holding={holdings} />
        <HoldingCard holding={holdings} /> */}
      </View>
    </SafeAreaView>
  );
};

export default PositionCard;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 'auto',
    color: 'white',
    borderRadius: 5,
    dropShadow: 5,
  },
  shadow: {
    borderWidth: 1,
    borderColor: 'black',
  },
});
