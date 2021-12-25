import React, {useContext, useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';
import {globalStyles} from '../utils/styles';

import PositionCard from '../components/PositionCard';
import Firebase from '../utils/Firebase';

const HomeScreen = ({route}) => {
  const {user, logout} = useContext(AuthContext); //get user info and data - to get user ID for example {user.uid}
  const modalizeState = useRef(null);

  const [tickerToDelete, setTickerToDelete] = useState(null);
  const [tickerToUpdate, setTickerToUpdate] = useState(null);
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

  const resetDelete = () => {
    setTickerToDelete(null);
  };

  useEffect(() => {
    if (typeof route.params !== 'undefined') {
      // the variable is defined, check if it has ticker
      if (route.params.hasOwnProperty('ticker')) {
        Firebase.deleteAsset(route.params.ticker, user.uid);

        // set ticker delete for position card so it's removed from list
        setTickerToDelete(route.params.ticker);
      }
      // If changes made on the edit screen
      // send these changes to position card from here
      if (route.params.hasOwnProperty('updateInfo')) {
        setTickerToUpdate(route.params.updateInfo);
      }
    }
  }, [route.params]);

  const onFieldChange = e => {
    const {name, value} = e;
    const newState = Object.assign({}, newHolding, {
      [name]: value.toUpperCase(),
    });
    setNewHolding(newState);
  };

  const resetUpdate = () => {
    setTickerToUpdate(null);
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

  return (
    <SafeAreaView style={{flex: 1, flexDirection: 'column'}}>
      <View style={[styles.container, globalStyles.card]}>
        <PositionCard
          user={user}
          deletion={{
            resetDelete: resetDelete,
            tickerToDelete: tickerToDelete,
          }}
          updates={{
            resetUpdate: resetUpdate,
            tickerToUpdate: tickerToUpdate,
          }}
          newHolding={newHolding}
          resetFields={resetFields}
        />
      </View>

      <Modalize ref={modalizeState} snapPoint={500}>
        <View style={[styles.modalizeContainer, {marginTop: 15}]}>
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

      <View style={styles.buttonContainer}>
        <FormButton
          buttonTitle="Add Position"
          onPress={() => modalizeState.current?.open()}
        />
        <FormButton buttonTitle="Logout" onPress={() => logout()} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    margin: 20,
    height: '75%',
    // alignSelf: 'flex-end',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  modalizeContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    // backgroundColor: 'red',
    paddingHorizontal: 20,
    height: 'auto',
    alignItems: 'center',
    marginTop: 'auto',
  },
  titleText: {
    paddingBottom: 20,
    fontSize: 25,
    fontWeight: '500',
  },
  card: {
    borderRadius: 20,
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
