import React, {useState, useEffect, useRef, createContext} from 'react';

import {StyleSheet, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import formatter from '../utils/NumberFormatter';
import {useNavigation} from '@react-navigation/native';

export const assetContext = createContext();

const HoldingCard = prop => {
  const [price, setPrice] = useState(prop.data.currPrice);
  const [shares, setShares] = useState(prop.data.numShares);
  const navigation = useNavigation();

  useEffect(() => {
    setPrice(prop.data.currPrice);
    setShares(prop.data.numShares);
  }, [prop.data.currPrice, prop.data.numShares]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate('EditAsset', {
          ticker: prop.data.ticker,
          numShares: prop.data.numShares,
          avgPrice: prop.data.avgPrice,
          price: price,
          tag: prop.data.tag,
          test: prop.test,
        })
      }>
      <View style={styles.holdingInfo}>
        <Text style={[styles.holdingFont, {textAlign: 'left'}]}>
          {prop.data.ticker}
        </Text>
        <Text style={[styles.holdingFont, {textAlign: 'center'}]}>
          {shares}
        </Text>
        <Text style={[styles.holdingFont, {textAlign: 'right'}]}>
          {formatter.format(price)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default HoldingCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginTop: 15,
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#DDDDDD',
    borderRadius: 8,
  },
  holdingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  holdingFont: {
    width: '33.333%',
    fontSize: 15,
    fontWeight: 'bold',
  },
  containerModal: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  titleText: {
    paddingBottom: 20,
    fontSize: 25,
  },
});
