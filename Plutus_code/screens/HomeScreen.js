/* eslint-disable prettier/prettier */
import React, {useState, useContext, useRef, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Modalize } from 'react-native-modalize';
import firestore, { firebase } from '@react-native-firebase/firestore';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';

const HomeScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext); //get user info and data - to get user ID for example {user.uid}

  const [ticker, setTicker] = useState(null);
  const [numShares, setNumShares] = useState(null);
  const [avgPrice, setAvgPrice] = useState(null);
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);

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

  useEffect(() => {
    const fetchData = async() => {
      try {
        const list = [];
        await firestore()
        .collection('assets')
        .where('userId', '==', user.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(doc => {
            const {ticker, numShare, avgPrice, tag, userId} = doc.data();
            list.push({
              ticker: ticker,
              numShare: numShare,
              avgPrice: avgPrice,
              tag: tag,
              userId: userId,
             });
          });
        });
        setPost(list);
        if (loading){
          setLoading(false);
        }
        console.log('Assets: ', list);
      } catch (e) {
        console.log('Fetch error is: ', e);
      }
    };
    fetchData();
  }, []);

  return (
      <View style={styles.container}>
          <Text> Home Screen </Text>
          <FormButton buttonTitle="Add Position" onPress={() => modalizeRef.current?.open()} />

          <Modalize ref={modalizeRef} snapPoint={25}>
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
