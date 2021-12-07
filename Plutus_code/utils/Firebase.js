import React from 'react';

import firestore, { firebase } from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';
import { Alert } from "react-native";


class Firebase {

  static async addAssets(user, ticker, numShares, avgPrice, tag) {
    console.log('Got to addAssets func');
    console.log('Ticker' + ticker);
    console.log('Num shares' + numShares);
    console.log('Avg Price' + avgPrice);
    console.log('Tag' + tag);
    firestore().collection('assets').add({
        userId: user.uid,
        ticker: ticker,
        numShare: numShares,
        avgPrice: avgPrice,
        tag: tag,
      })
      .then(() => {
        console.log('Added Asset');
        Alert.alert( //delete later
          'Asset published!',
          'Your Asset has been published Successfully!',
        );
        // setTicker(null);
        // setNumShares(null);
        // setAvgPrice(null);
        // setTag(null);
      })
      .catch((error) => {
        console.log('Something went wrong with added post to firestore.', error);
      });
  };

  static fetchData(user) {
    return firestore()
      .collection('assets')
      .where('userId', '==', user.uid)
      .get();
  };

  static updateAsset(getAssetFirebaseID, holdingList, indexTemp) {
    firestore()
      .collection('assets')
      .doc(getAssetFirebaseID)
      .update({
        numShare: holdingList[indexTemp].numShare,
      })
      .then(() => {
        console.log('Asset updated correctly');
      });
  }

  static createObject(doc) {
    const key = Math.round(Math.random() * 100000000000);
    // parse the doc object data
    const {
      ticker,
      numShare,
      avgPrice,
      tag,
      userId,
      uniqueID,
      assetType,
      assetFirebaseID,
    } = doc.data();

    // create the new object to add to the list
    return {
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
    };
  }
}

export default Firebase;
