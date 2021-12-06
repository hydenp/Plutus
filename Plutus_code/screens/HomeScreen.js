/* eslint-disable prettier/prettier */
import React, {useState, useContext, useRef, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from "react-native";
import { Modalize } from 'react-native-modalize';
import firestore, { firebase } from '@react-native-firebase/firestore';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';

import PositionCard from '../components/PositionCard';
import HoldingCard from '../components/HoldingCard';
import { block } from 'react-native-reanimated';

const HomeScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext); //get user info and data - to get user ID for example {user.uid}

  const [ticker, setTicker] = useState(null);
  const [numShares, setNumShares] = useState(null);
  const [avgPrice, setAvgPrice] = useState(null);
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [holdingList, setHoldingList] = useState([]);

  const modalizeRef = useRef(null);

  const addAssets = async () => {
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
      setTicker(null);
      setNumShares(null);
      setAvgPrice(null);
      setTag(null);
    })
    .catch((error) => {
      console.log('Something went wrong with added post to firestore.', error);
    });
  };

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
            const {ticker, numShare, avgPrice, currPrice, tag, userId} = doc.data();
            list.push({
              id: key,
              ticker: ticker,
              numShare: numShare,
              avgPrice: avgPrice,
              currPrice: '--.--',
              tag: tag,
              userId: userId,
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

          <Modalize ref={modalizeRef} snapPoint={250}>
            <View style={styles.container}>
              <Text style={styles.titleText}> Add Position </Text>
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
              <FormButton buttonTitle="Save" onPress={addAssets}/>
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
