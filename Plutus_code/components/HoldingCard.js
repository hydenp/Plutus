import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import TickerInfo from '../utils/TickerInfo';

const HoldingCard = prop => {
  // const [price, setPrice] = useState(prop.data.currPrice);
  const [price, setPrice] = useState(prop.currPrice);


  console.log("From holding card, here is the props");
  console.log(prop);

  // async function updatePrice() {
  //   var x = new TickerInfo(ticker);
  //   await x.do();
  //   setPrice(x.data.c);
  // }
  //
  useEffect(() => {
    console.log("*****************************************");
    console.log('new prop?');
    console.log(prop);
    setPrice(prop.data.currPrice);
  }, [prop, prop.currPrice]);

  return (
    <View style={styles.container}>
      <Text>{prop.data.ticker}</Text>
      <Text>{prop.data.numShare}</Text>
      <Text>${price}</Text>
      {/*<Text>Price</Text>*/}
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
    width: '80%',
    height: 50,
    // color: 'white',
    backgroundColor: 'grey',
    borderRadius: 8,
  },
});
