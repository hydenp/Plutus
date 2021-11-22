import React from 'react';

import {StyleSheet, View, Text, SafeAreaView, Flatlist} from 'react-native';
import HoldingCard from './HoldingCard';

const PositionCard = ({holdings}) => {
  console.log(holdings);

  // const renderItem = () => {
  //   <HoldingCard />;
  // };

  return (
    <SafeAreaView style={{...styles.container, ...styles.shadow}}>
      <View style={styles.container}>
        <Text>Card Title</Text>
        <HoldingCard holding={holdings[0]} />
        <HoldingCard holding={holdings[1]} />
        {/* <Flatlist data={holdings} renderItem={renderItem} /> */}
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
