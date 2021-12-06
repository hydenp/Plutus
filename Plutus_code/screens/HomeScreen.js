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

  const checker = () => {
    var assetAlreadyExist = false;
    var indexTemp = 0;

    for (var i = 0; i < holdingList.length; i++){
      if (ticker === holdingList[i].ticker){
        assetAlreadyExist = true;
        indexTemp = i;
        var getAssetFirebaseID = holdingList[i].assetFirebaseID;
      }
    }
    if (assetAlreadyExist){
      //decorate asset obj here
      var numSharesUpdate = new AssetDecorator(holdingList[indexTemp], numShares);
      numSharesUpdate.decorateAsset();

      //update asset on Firebase
      firestore()
        .collection('assets')
        .doc(getAssetFirebaseID)
        .update({
          numShare: holdingList[indexTemp].numShare,
        })
        .then(() => {
          console.log('Asset updated correctly');
        });

        setTicker(null);
        setNumShares(null);
        setAvgPrice(null);
        setTag(null);
        setAssetType(null);
    }
    else {
      Firebase.addAssets(user, ticker, numShares, avgPrice, tag);
    }
  };

  // const addAssets = async () => {
  //   firestore().collection('assets').add({
  //     userId: user.uid,
  //     ticker: ticker,
  //     numShare: numShares,
  //     avgPrice: avgPrice,
  //     tag: tag,
  //     uniqueID: uuid(),
  //     assetType: assetType,
  //   })
  //   .then(function(docRef) {
  //     console.log('Added Asset with id: ' + docRef.id);
  //     Alert.alert( //delete later
  //       'Asset published!',
  //       'Your Asset has been published successfully!',
  //     );
  //     setTicker(null);
  //     setNumShares(null);
  //     setAvgPrice(null);
  //     setTag(null);
  //     setAssetType(null);
  //   })
  //   .catch((error) => {
  //     console.log('Something went wrong with added post to firestore.', error);
  //   });
  // };



  const fetchData = async() => {
    try {
      const list = [];
      await firestore()
        .collection('assets')
        .where('userId', '==', user.uid)
        .get()
        .then((querySnapshot) => {

          querySnapshot.forEach(doc => {
            const key = Math.round(Math.random() * 100000000000);
            const {ticker, numShare, avgPrice, tag, userId, uniqueID, assetType, assetFirebaseID} = doc.data();

            list.push({
              id: key,
              ticker: ticker,
              numShare: numShare,
              avgPrice: avgPrice,
              currPrice: '--.--',
              tag: tag,
              userId: userId,
              uniqueID: uniqueID,
              assetType: assetType,
              assetFirebaseID: doc.id,
             });
          });
        });
      console.log("List = " + list)
      setHoldingList(list);
      if (loading){
        setLoading(false);
      }
      console.log('Assets: ', list);
    } catch (e) {
      console.log('Fetch error is: ', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.container}>
          {/*<Text> Home Screen </Text>*/}
          {/* <PositionCard holdings={holdingList}/> */}
          {/* {console.log('TEST: ' + holdingList.map(block => PositionCard(block)))} */}


          {/*{holdingList.map((holdingList, key) => <HoldingCard key={key} ticker={holdingList.ticker} numShares={holdingList.numShare}/>)}*/}
          <View style={styles.boxWithShadow}>
            <PositionCard  holdingList={holdingList}/>
          </View>

          <FormButton buttonTitle="Add Position" onPress={() => modalizeRef.current?.open()} />


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
