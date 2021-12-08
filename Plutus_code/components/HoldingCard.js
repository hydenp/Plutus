/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useRef, createContext} from 'react';

import {StyleSheet, View, Text} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import formatter from '../utils/NumberFormatter';
import { Modalize } from 'react-native-modalize';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AppStack } from '../navigation/AppStack';
import HomeScreen from '../screens/HomeScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationHelpersContext } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';
import EditAssetScreen from '../screens/EditAssetScreen';

export const assetContext = createContext();

const HoldingCard = (prop) => {
  const [price, setPrice] = useState(prop.data.currPrice);
  const [shares, setShares] = useState(prop.data.numShare);
  const modalizeRefEdit =  useRef(null);
  const navigation = useNavigation();

  // console.log("From holding card, here is the props");
  // console.log(prop);

  useEffect(() => {
    // console.log("Hi from Hodling");
    // console.log(prop.data.assetFirebaseID);
    setPrice(prop.data.currPrice);
    setShares(prop.data.numShare);
  }, [prop.data.currPrice, prop.data.numShare]);

  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('EditAsset', {getTicker: prop.data.ticker, getShares: shares, getPrice: price, getID: prop.data.assetFirebaseID, getTag: prop.data.tag})}>
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
