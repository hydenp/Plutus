/* eslint-disable prettier/prettier */
import firestore, { firebase } from '@react-native-firebase/firestore';

class Firebase {
  static addAssets(user, ticker, numShares, avgPrice, tag) {
    firestore().collection('assets').add({
      userId: user.uid,
      ticker: ticker,
        numShare: numShares,
        avgPrice: avgPrice,
        tag: tag,
      });
  }

  static async handleAdd(user, ticker, numShares, avgPrice, tag) {
    return Firebase.addAssets(user, ticker, numShares, avgPrice, tag).then(
      res => {
        return res.id;
      },
    );

  }


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
      // console.log(newAsset);
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
    if (changeNumSharesVal != null){
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
    if (changeTagVal != null){
      firestore()
      .collection('assets')
      .doc(assetFirebaseID)
      .update({
        tag: changeTagVal,
      })
      .then(() => {
        console.log('Asset updated correctly');
      });
    }
    else {
      console.log('Error uopdating assets');
    }

  }

  static deleteAsset(assetFirebaseID) {
    if (assetFirebaseID == null){
      console.log('Error: asset id not found');
    }
    else {
      firestore()
      .collection('assets')
      .doc(assetFirebaseID)
      .delete();
    }
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
