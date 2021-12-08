/* eslint-disable prettier/prettier */
import React, {useState, useContext, useRef, useEffect} from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Modalize } from 'react-native-modalize';


import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import PositionCard from '../components/PositionCard';
import AssetDecorator from '../utils/AssetDecorator';

import Firebase from '../utils/Firebase';


const HomeScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext); //get user info and data - to get user ID for example {user.uid}

  const [ticker, setTicker] = useState(null);
  const [numShares, setNumShares] = useState(null);
  const [avgPrice, setAvgPrice] = useState(null);
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [holdingList, setHoldingList] = useState([]);

  //THIS IS AN EXAMPLE OF THE SINGLETON PATTERN
  var Singleton = (function () {
    var modalizeRef;

    function createInstance() {
      return useRef(null);
    }

    return {
        getInstance: function (open) {
            if (!modalizeRef) {
              modalizeRef = createInstance();
            }
            if (open === true){
              modalizeRef.current?.open();
            }
            return modalizeRef;
        },
        // function to set modal closed or open
        setInstance: function (status) {
          if (!modalizeRef) {
            modalizeRef = createInstance();
          }
          if (status === true){
            modalizeRef.current?.open();
          }
          if (status === false){
            modalizeRef.current?.close();
          }
          return modalizeRef;
        },
    };
  })();

  const checker = async() => {
    let assetAlreadyExist = false;
    let indexTemp = 0;

    for (var i = 0; i < holdingList.length; i++){
      if (ticker === holdingList[i].ticker){
        assetAlreadyExist = true;
        indexTemp = i;
        var getAssetFirebaseID = holdingList[i].assetFirebaseID;
      }
    }
    // when updating an asset
    if (assetAlreadyExist) {

      // make an async update to the holdingList
      await (async function() {
        const items = [...holdingList];
        const item = { ...holdingList[indexTemp] };
        item.numShare = parseInt(numShares) + parseInt(item.numShare);
        items[indexTemp] = item;
        setHoldingList(items);
      })();

      //decorate asset obj here

      var numSharesUpdate = new AssetDecorator(holdingList[indexTemp], numShares); //THIS IS AN EXAMPLE OF DECORATOR PATTERN
      numSharesUpdate.decorateAsset();

      //update asset on Firebase
      Firebase.updateAsset(getAssetFirebaseID, holdingList, indexTemp);

      // reset form input fields
      setTicker(null);
      setNumShares(null);
      setAvgPrice(null);
      setTag(null);
    }
    else {
      // add the new asset
      const docID = await Firebase.handleAdd(user, ticker, numShares, avgPrice, tag);
      console.log('Doc ID: ' + docID);
      // search for the new asset
      const newAsset = await Firebase.handleFetchDocument(docID);
      console.log('New Asset: ' + newAsset);
      await (async function() {
        const newList = [...holdingList, newAsset];
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
          <PositionCard  holdingList={holdingList}/>
          <FormButton buttonTitle="Add Position" onPress={() => Singleton.getInstance(true)} /> {/*//THIS IS AN EXAMPLE OF DECORATOR PATTERN */}


          <Modalize ref={Singleton.getInstance(false)} snapPoint={500}>{/*//THIS IS AN EXAMPLE OF DECORATOR PATTERN */}

            <View style={styles.container}>
              <Text style={styles.titleText}> Add a new position </Text>
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
});
