import React, {useContext, useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';

import PositionCard from '../components/PositionCard';
import AssetDecorator from '../utils/AssetDecorator';
import Firebase from '../utils/Firebase';

const HomeScreen = () => {
  const {user, logout} = useContext(AuthContext); //get user info and data - to get user ID for example {user.uid}

  const [ticker, setTicker] = useState(null);
  const [numShares, setNumShares] = useState(null);
  const [avgPrice, setAvgPrice] = useState(null);
  const [tag, setTag] = useState(null);

  // Stores the list of Holdings
  // OBSERVER
  // changes in this list are automatically updating in the PositionCard
  const [holdingList, setHoldingList] = useState([]);

  var Singleton = (function () {
    let modalizeRef;

    function createInstance() {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useRef(null);
    }

    return {
      getInstance: function (open) {
        if (!modalizeRef) {
          modalizeRef = createInstance();
        }
        if (open === true) {
          modalizeRef.current?.open();
        }
        return modalizeRef;
      },
      // function to set modal closed or open
      setInstance: function (status) {
        if (!modalizeRef) {
          modalizeRef = createInstance();
        }
        if (status === true) {
          modalizeRef.current?.open();
        }
        if (status === false) {
          modalizeRef.current?.close();
        }
        return modalizeRef;
      },
    };
  })();

  const checker = async () => {
    let assetAlreadyExist = false;
    let indexTemp = 0;

    let i;
    for (i = 0; i < holdingList.length; i++) {
      if (ticker === holdingList[i].ticker) {
        assetAlreadyExist = true;
        indexTemp = i;
        var getAssetFirebaseID = holdingList[i].assetFirebaseID;
      }
    }
    // when updating an asset
    if (assetAlreadyExist) {
      // close the modal
      Singleton.setInstance(false);

      // make an async update to the holdingList
      await (async function () {
        const items = [...holdingList];
        const item = {...holdingList[indexTemp]};
        item.numShare = parseInt(numShares) + parseInt(item.numShare);
        items[indexTemp] = item;
        setHoldingList(items);
      })();

      // decorate asset obj here
      // DECORATOR
      const numSharesUpdate = new AssetDecorator(
        holdingList[indexTemp],
        numShares,
      );
      numSharesUpdate.decorateAsset();

      // update asset on Firebase
      Firebase.updateAsset(getAssetFirebaseID, holdingList, indexTemp);

      // reset form input fields
      setTicker(null);
      setNumShares(null);
      setAvgPrice(null);
      setTag(null);
    } else {
      // close the modal
      Singleton.setInstance(false);

      const addThis = {
        id: Math.round(Math.random() * 100000000000),
        userId: user.uid,
        ticker: ticker,
        numShare: numShares,
        avgPrice: avgPrice,
        tag: tag,
      };
      // update the holding list with the new asset
      await (async function () {
        const newList = [...holdingList, addThis];
        setHoldingList(newList);
      })();

      // add the new asset
      Firebase.addAssets(user, ticker, numShares, avgPrice, tag);

      // reset fields for add modal
      setTicker(null);
      setNumShares(null);
      setAvgPrice(null);
      setTag(null);
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
    });
  }, [user]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <PositionCard holdingList={holdingList} />

        <FormButton
          buttonTitle="Add Position"
          onPress={() => Singleton.getInstance(true)}
        />

        <Modalize ref={Singleton.getInstance(false)} snapPoint={500}>
          <View style={styles.container}>
            <Text style={styles.titleText}> Add a new position </Text>
            <FormInput
              value={ticker}
              onChangeText={ticekerValue => setTicker(ticekerValue)}
              placeholder="Ticker"
              autoCorrect={false}
            />
            <FormInput
              labelValue={numShares}
              onChangeText={numSharesValue => setNumShares(numSharesValue)}
              placeholder="# of Shares"
              autoCorrect={false}
              keyBoardType="numeric"
            />
            <FormInput
              labelValue={avgPrice}
              onChangeText={avgPriceValue => setAvgPrice(avgPriceValue)}
              placeholder="Average Price"
              autoCorrect={false}
              keyBoardType="numeric"
            />
            <FormInput
              labelValue={tag}
              onChangeText={tagValue => setTag(tagValue)}
              placeholder="Tag"
              autoCorrect={false}
            />
            <FormButton buttonTitle="Save" onPress={checker} />
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
