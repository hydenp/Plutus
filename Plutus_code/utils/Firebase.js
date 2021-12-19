import React from 'react';
import firestore, {firebase} from '@react-native-firebase/firestore';

class Firebase {
  // add a new asset to firebase
  static addAssets(user, {ticker, numShares, avgPrice, tag}) {
    return firestore().collection('assets').add({
      userId: user.uid,
      ticker: ticker,
      numShare: numShares,
      avgPrice: avgPrice,
      tag: tag,
    });
  }

  // static async handleAdd(user, ticker, numShares, avgPrice, tag) {
  //   return Firebase.addAssets(user, ticker, numShares, avgPrice, tag).then(
  //     res => {
  //       return res.id;
  //     },
  //   );
  // }

  static fetchData(user) {
    return firestore()
      .collection('assets')
      .where('userId', '==', user.uid)
      .get();
  }

  static async handleFetchDocument(docID) {
    return Firebase.fetchDocument(docID).then(res => {
      let newAsset = null;
      res.forEach(doc => {
        newAsset = Firebase.createObject(doc);
      });
      return newAsset;
    });
  }

  static async fetchDocument(docID) {
    return firestore()
      .collection('assets')
      .where(firebase.firestore.FieldPath.documentId(), '==', docID)
      .get();
  }

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

  static editAsset(assetFirebaseID, changeNumSharesVal, changeTagVal) {
    if (changeNumSharesVal != null) {
      firestore()
        .collection('assets')
        .doc(assetFirebaseID)
        .update({
          numShare: changeNumSharesVal,
        })
        .then(() => {
          console.log('Asset updated correctly');
        });
    }
    if (changeTagVal != null) {
      firestore()
        .collection('assets')
        .doc(assetFirebaseID)
        .update({
          tag: changeTagVal,
        })
        .then(() => {
          console.log('Asset updated correctly');
        })
        .catch(error => {
          console.log('Error updating assets');
        });
    }
  }

  static deleteAsset(assetFirebaseID) {
    if (assetFirebaseID == null) {
      console.log('Error: asset id not found');
    } else {
      firestore().collection('assets').doc(assetFirebaseID).delete();
    }
  }

  static createObject(doc) {
    const key = Math.round(Math.random() * 100000000000);
    // parse the doc object data
    const {ticker, numShare, avgPrice, tag, userId} = doc.data();

    // create the new object to add to the list
    return {
      id: key,
      ticker: ticker,
      numShares: numShare,
      avgPrice: avgPrice,
      currPrice: 0.0,
      tag: tag,
      userId: userId,
    };
  }
}

export default Firebase;
