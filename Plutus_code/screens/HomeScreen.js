import React, {useContext, useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';

import PositionCard from '../components/PositionCard';

const HomeScreen = () => {
  const {user, logout} = useContext(AuthContext); //get user info and data - to get user ID for example {user.uid}
  const modalizeState = useRef(null);

  const [newHolding, setNewHolding] = useState({
    ticker: null,
    numShares: null,
    avgPrice: null,
    tag: null,
    submit: false,
  });

  const addPosition = () => {
    if (newHolding.ticker && newHolding.numShares) {
      const newState = Object.assign({}, newHolding, {
        ['submit']: true,
        ['id']: Math.round(Math.random() * 100000000000),
      });
      setNewHolding(newState);
      modalizeState.current?.close();
    } else {
      alert('Please provide a Ticker and the Number of Shares');
    }
  };

  // const checker = async () => {
  //   let assetAlreadyExist = false;
  //   let indexTemp = 0;
  //
  //   let i;
  //   for (i = 0; i < holdingList.length; i++) {
  //     if (ticker === holdingList[i].ticker) {
  //       assetAlreadyExist = true;
  //       indexTemp = i;
  //       var getAssetFirebaseID = holdingList[i].assetFirebaseID;
  //     }
  //   }
  //   // when updating an asset
  //   if (assetAlreadyExist) {
  //     // close the modal
  //     Singleton.setInstance(false);
  //
  //     // make an async update to the holdingList
  //     await (async function () {
  //       const items = [...holdingList];
  //       const item = {...holdingList[indexTemp]};
  //       item.numShare = parseInt(numShares) + parseInt(item.numShare);
  //       items[indexTemp] = item;
  //       setHoldingList(items);
  //     })();
  //
  //     // decorate asset obj here
  //     // DECORATOR
  //     const numSharesUpdate = new AssetDecorator(
  //       holdingList[indexTemp],
  //       numShares,
  //     );
  //     numSharesUpdate.decorateAsset();
  //
  //     // update asset on Firebase
  //     Firebase.updateAsset(getAssetFirebaseID, holdingList, indexTemp);
  //
  //     // reset form input fields
  //     setTicker(null);
  //     setNumShares(null);
  //     setAvgPrice(null);
  //     setTag(null);
  //   } else {
  //     // close the modal
  //     Singleton.setInstance(false);
  //
  //     const addThis = {
  //       id: Math.round(Math.random() * 100000000000),
  //       userId: user.uid,
  //       ticker: ticker,
  //       numShare: numShares,
  //       avgPrice: avgPrice,
  //       tag: tag,
  //     };
  //     // update the holding list with the new asset
  //     await (async function () {
  //       const newList = [...holdingList, addThis];
  //       setHoldingList(newList);
  //     })();
  //
  //     // add the new asset
  //     Firebase.addAssets(user, ticker, numShares, avgPrice, tag);
  //
  //     // reset fields for add modal
  //     setTicker(null);
  //     setNumShares(null);
  //     setAvgPrice(null);
  //     setTag(null);
  //   }
  // };

  // useEffect(() => {
  //   Firebase.fetchData(user).then(querySnapshot => {
  //     const list = [];
  //     querySnapshot.forEach(doc => {
  //       const nextAsset = Firebase.createObject(doc);
  //       list.push(nextAsset);
  //     });
  //     setHoldingList(list);
  //   });
  // }, [user]);

  const onFieldChange = e => {
    const {name, value} = e;
    const newState = Object.assign({}, newHolding, {
      [name]: value.toUpperCase(),
    });
    setNewHolding(newState);
  };

  const resetFields = () => {
    setNewHolding({
      ticker: null,
      numShares: null,
      avgPrice: null,
      tag: null,
      submit: false,
    });
  };

  // useEffect(() => {
  //   console.log(modalizeState.current);
  // }, [modalizeState]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <PositionCard
          user={user}
          newHolding={newHolding}
          resetFields={resetFields}
        />

        <FormButton
          buttonTitle="Add Position"
          onPress={() => modalizeState.current?.open()}
        />

        <Modalize ref={modalizeState} snapPoint={500}>
          <View style={styles.container}>
            <Text style={styles.titleText}> Add a new position </Text>
            <FormInput
              value={newHolding.ticker}
              onChangeText={value => onFieldChange({name: 'ticker', value})}
              placeholder="Ticker"
              autoCorrect={false}
            />
            <FormInput
              value={newHolding.numShares}
              onChangeText={value => onFieldChange({name: 'numShares', value})}
              placeholder="Number of Shares"
              autoCorrect={false}
              keyBoardType="numeric"
            />
            <FormInput
              value={newHolding.avgPrice}
              onChangeText={value => onFieldChange({name: 'avgPrice', value})}
              placeholder="Average Price"
              autoCorrect={false}
              keyBoardType="numeric"
            />
            <FormInput
              value={newHolding.tag}
              onChangeText={value => onFieldChange({name: 'tag', value})}
              placeholder="Tag"
              autoCorrect={false}
            />
            <FormButton buttonTitle="Save" onPress={addPosition} />
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
