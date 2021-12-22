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

  // OBSERVER
  // when the change is received, we update these observers
  // the values are then reflected in the display below
  useEffect(() => {
    console.log(prop);
    setPrice(prop.data.currPrice);
    setShares(prop.data.numShares);
  }, [prop.data.currPrice, prop.data.numShares]);

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() =>
          navigation.navigate('EditAsset', {
            ticker: prop.data.ticker,
            numShares: prop.data.numShares,
            price: price,
            tag: prop.data.tag,
          })
        }>
        <Text style={styles.holdingFont}>{prop.data.ticker}</Text>
        <Text style={styles.holdingFont}>{shares}</Text>
        <Text style={styles.holdingFont}>{formatter.format(price)}</Text>
      </TouchableOpacity>
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
