/* eslint-disable prettier/prettier */
import React, {useState, useContext, useRef, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from "react-native";
import firestore, { firebase, query, where, collection } from '@react-native-firebase/firestore';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';

import AssetDecorator from '../utils/AssetDecorator';

import Firebase from "../utils/Firebase";

import { AppStack } from '../navigation/AppStack';
import HoldingCard, { assetContext } from '../components/HoldingCard';


const EditAssetScreen = ({route}) => {
  // const {price} = useContext(assetContext);
  // var assetId
  // function assets(assetId){
  //   this.assetId  = assetId;

  // }
  const { ticker, shares , price} = route.params;

  return (
    <SafeAreaView>
      <View style={styles.container}>
              <Text style={styles.titleText}> {ticker} </Text>
              <FormInput
                value={shares}
                // onChangeText={(ticekerValue) => setTicker(ticekerValue)}
                placeholder= {"# of shares: " + JSON.stringify(shares)}
                autoCorrect={false}
              />
              {/* <FormButton buttonTitle="Save" onPress={checker}/> */}
            </View>
    </SafeAreaView>
  );
};

export default EditAssetScreen;

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      paddingTop: 50,
    },
    titleText: {
      paddingBottom: 20,
      fontSize: 25,
    },
    // boxWithShadow: {
    //   shadowColor: '#000',
    //   shadowOffset: { width: 0, height: 1 },
    //   shadowOpacity: 0.8,
    //   shadowRadius: 2,
    //   elevation: 5,
    // },
});
