/* eslint-disable prettier/prettier */
import React, {useState, useContext, useRef, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from "react-native";
import { Modalize } from 'react-native-modalize';
import firestore, { firebase, query, where, collection } from '@react-native-firebase/firestore';
import uuid from 'uuid/v4';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';

import PositionCard from '../components/PositionCard';
import HoldingCard from '../components/HoldingCard';
import AssetDecorator from '../utils/AssetDecorator';
import DropDown from '../components/DropDown';

import Firebase from "../utils/Firebase";


const HomeScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext); //get user info and data - to get user ID for example {user.uid}

  const [ticker, setTicker] = useState(null);
  const [numShares, setNumShares] = useState(null);
  const [avgPrice, setAvgPrice] = useState(null);
  const [tag, setTag] = useState(null);
  const [assetType, setAssetType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [holdingList, setHoldingList] = useState([]);


  var Singleton = (function () {
    var modalizeRef;

    function createInstance() {
        const modalizeRef = useRef(null);
        return modalizeRef;
    }

    return {
        getInstance: function (open) {
            if (!modalizeRef) {
              modalizeRef = createInstance();
            }
            if(open == true){
              modalizeRef.current?.open();
            }
            return modalizeRef;
        }
    };
  })();

  const checker = async() => {
    var assetAlreadyExist = false;
    var indexTemp = 0;

    for (var i = 0; i < holdingList.length; i++){
      if (ticker === holdingList[i].ticker){
        assetAlreadyExist = true;
        indexTemp = i;
        var getAssetFirebaseID = holdingList[i].assetFirebaseID;
      }
    }
    if (assetAlreadyExist) {

      // make an async update to the holdingList
      await (async function() {
        const items = [...holdingList];
        const item = { ...holdingList[indexTemp] };
        item.numShare = parseInt(numShares) + parseInt(item.numShare);
        items[indexTemp] = item;
        console.log('result =', items);
        setHoldingList(items);
      })();
      console.log(holdingList);


      //decorate asset obj here
      var numSharesUpdate = new AssetDecorator(holdingList[indexTemp], numShares);
      numSharesUpdate.decorateAsset();

      //update asset on Firebase
      Firebase.updateAsset(getAssetFirebaseID, holdingList, indexTemp);

      setTicker(null);
      setNumShares(null);
      setAvgPrice(null);
      setTag(null);
      setAssetType(null);
    }
    else {

      // add the new asset
      const docID = await Firebase.handleAdd(user, ticker, numShares, avgPrice, tag);
      console.log(docID);

      // search for the new asset
      const newAsset = await Firebase.handleFetchDocument(docID);
      console.log("NEW ASSET YEE?");
      console.log(newAsset);

      await (async function() {
        const newList = [...holdingList, newAsset]
        setHoldingList(newList);
      })();
    }
  };

  useEffect(() => {
    Firebase.fetchData(user).then(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const nextAsset = Firebase.createObject(doc);
        list.push(nextAsset);
      });
      setHoldingList(list);
      setLoading(false);
    });
  }, [user]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
          {/*<Text> Home Screen </Text>*/}
          {/* <PositionCard holdings={holdingList}/> */}
          {/* {console.log('TEST: ' + holdingList.map(block => PositionCard(block)))} */}


          {/*{holdingList.map((holdingList, key) => <HoldingCard key={key} ticker={holdingList.ticker} numShares={holdingList.numShare}/>)}*/}
          {/*<View style={styles.boxWithShadow}>*/}
            <PositionCard  holdingList={holdingList}/>
          {/*</View>*/}

          <FormButton buttonTitle="Add Position" onPress={() => Singleton.getInstance(true)} />


          <Modalize ref={Singleton.getInstance(false)} snapPoint={400}>
            <View style={styles.container}>
              <Text style={styles.titleText}> Add a new position </Text>
              {/* <FormInput
                labelValue={assetType}
                onChangeText={(assetTypeValue) => setAssetType(assetTypeValue)}
                placeholder="Temp: Asset Type (Stock, Bond, REITs)"
                autoCorrect={false}
              /> */}
              <FormInput
                value={ticker}
                onChangeText={(ticekerValue) => setTicker(ticekerValue)}
                placeholder="Ticker"
                autoCorrect={false}
              />
              <FormInput
                labelValue={numShares}
                onChangeText={(numSharesValue) => setNumShares(numSharesValue)}
                placeholder="# of Shares"
                autoCorrect={false}
                keyBoardType="numeric"
              />
              <FormInput
                labelValue={avgPrice}
                onChangeText={(avgPriceValue) => setAvgPrice(avgPriceValue)}
                placeholder="Average Price"
                autoCorrect={false}
                keyBoardType="numeric"
              />
              <FormInput
                labelValue={tag}
                onChangeText={(tagValue) => setTag(tagValue)}
                placeholder="Tag"
                autoCorrect={false}
              />
              <FormButton buttonTitle="Save" onPress={checker}/>
            </View>
          </Modalize>

          <FormButton buttonTitle="Logout" onPress={() => logout()} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

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
