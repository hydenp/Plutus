import React from 'react';
import firestore, {firebase} from '@react-native-firebase/firestore';

class Firebase {
  // add a new asset to firebase
  static addAssets(user, {ticker, numShares, avgPrice, tag}) {
    return firestore()
      .collection('assets')
      .add({
        userId: user.uid,
        ticker: ticker,
        numShares: isNaN(numShares) ? parseFloat(numShares) : null,
        avgPrice: isNaN(avgPrice) ? parseFloat(avgPrice) : null,
        tag: tag,
      });
  }

  static fetchData(user) {
    return firestore()
      .collection('assets')
      .where('userId', '==', user.uid)
      .get();
  }

  static updateAsset(user, ticker, updates) {
    const doc_query = firestore()
      .collection('assets')
      .where('ticker', '==', ticker, 'userID', '==', user.uid);
    doc_query.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.update(updates).catch(e => {
          console.log('update failed with' + e);
        });
      });
    });
  }

  // static editAsset(assetFirebaseID, changeNumSharesVal, changeTagVal) {
  //   if (changeNumSharesVal != null) {
  //     firestore()
  //       .collection('assets')
  //       .doc(assetFirebaseID)
  //       .update({
  //         numShare: changeNumSharesVal,
  //       })
  //       .then(() => {
  //         console.log('Asset updated correctly');
  //       });
  //   }
  //   if (changeTagVal != null) {
  //     firestore()
  //       .collection('assets')
  //       .doc(assetFirebaseID)
  //       .update({
  //         tag: changeTagVal,
  //       })
  //       .then(() => {
  //         console.log('Asset updated correctly');
  //       })
  //       .catch(error => {
  //         console.log('Error updating assets');
  //       });
  //   }
  // }

  // static deleteAsset(assetFirebaseID) {
  //   if (assetFirebaseID == null) {
  //     console.log('Error: asset id not found');
  //   } else {
  //     firestore().collection('assets').doc(assetFirebaseID).delete();
  //   }
  // }

  static deleteAsset(ticker, userID) {
    const doc_query = firestore()
      .collection('assets')
      .where('ticker', '==', ticker, 'userID', '==', userID);
    doc_query.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref
          .delete()
          .then(console.log('asset successfully deleted'))
          .catch(e => {
            console.log('delete asset failed with' + e);
          });
      });
    });
  }

  static createObject(doc) {
    const key = Math.round(Math.random() * 100000000000);
    // parse the doc object data
    const {ticker, numShares, avgPrice, tag, userId} = doc.data();

    // create the new object to add to the list
    return {
      id: key,
      ticker: ticker,
      numShares: numShares,
      avgPrice: avgPrice,
      currPrice: 0.0,
      tag: tag,
      userId: userId,
    };
  }
}

export default Firebase;
