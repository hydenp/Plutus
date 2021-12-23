import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import RadioGroup from 'react-native-radio-buttons-group';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

import Firebase from '../utils/Firebase';
import formatter from '../utils/NumberFormatter';
import {AuthContext} from '../navigation/AuthProvider';

const EditAssetScreen = ({route}) => {
  const navigation = useNavigation();

  const {user} = useContext(AuthContext);

  const [holdingInfo, setHoldingInfo] = useState(route.params);

  const [updateNumShare, setUpdateNumShare] = useState(null);
  const [updateAvgPrice, setUpdateAvgPrice] = useState(null);
  const [updateTag, setUpdateTag] = useState(null);

  const [saveButtonStatus, setSaveButtonStatus] = useState(true);
  const radioButtonsData = [
    {
      id: '1',
      label: 'Overwrite',
      value: 'option1',
      color: 'grey',
      selected: true,
    },
    {
      id: '2',
      label: 'Add',
      value: 'option2',
      color: 'grey',
      selected: false,
      disabled: holdingInfo.avgPrice === null || holdingInfo.avgPrice === 'Nan',
    },
  ];
  const [radioButtons, setRadioButtons] = useState(radioButtonsData);

  const onPressRadioButton = radioButtonsArray => {
    setRadioButtons(radioButtonsArray);
  };

  const resetFields = () => {
    setUpdateNumShare(null);
    setUpdateAvgPrice(null);
    setUpdateTag(null);
  };

  const handleUpdate = () => {
    const payload = {
      ...(updateNumShare !== null && {numShares: updateNumShare}),
      ...(updateAvgPrice !== null && {avgPrice: updateAvgPrice}),
      ...(updateTag !== null && {tag: updateTag}),
    };

    if (radioButtons[0].selected === true) {
      console.log('overwrite!');
      Firebase.updateAsset(user, holdingInfo.ticker, payload);

      const newState = Object.assign({}, holdingInfo, {
        ...payload,
      });
      setHoldingInfo(newState);
      resetFields();
    } else {
      console.log('add!');

      if (updateNumShare === null || updateAvgPrice === null) {
        alert('Please provide an average price for the new number of shares');
      } else {
        // calculate the new avg price
        const newAvgPrice =
          (parseFloat(holdingInfo.numShares) *
            parseFloat(holdingInfo.avgPrice) +
            parseFloat(updateAvgPrice) * parseFloat(updateNumShare)) /
          (parseFloat(holdingInfo.numShares) + parseFloat(updateNumShare));
        payload.avgPrice = newAvgPrice;
        payload.numShares =
          parseFloat(holdingInfo.numShares) + parseFloat(updateNumShare);

        const newState = Object.assign({}, holdingInfo, {
          ...payload,
        });
        setHoldingInfo(newState);
        resetFields();

        console.log(payload);
        Firebase.updateAsset(user, holdingInfo.ticker, payload);
      }
    }
  };

  useEffect(() => {
    if (updateNumShare !== null || updateTag !== null) {
      setSaveButtonStatus(false);
    } else {
      setSaveButtonStatus(true);
    }
  }, [updateNumShare, updateTag]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.titleText}> {holdingInfo.ticker} </Text>
        <Text style={styles.mktValueText}>
          {' '}
          Market Value:{' '}
          {formatter.format(holdingInfo.price * holdingInfo.numShares)}{' '}
        </Text>
        <Text style={styles.bodyText}>
          {' '}
          Number of Shares: {holdingInfo.numShares}{' '}
        </Text>
        <Text style={styles.bodyText}>
          {' '}
          Current Price: {formatter.format(holdingInfo.price)}{' '}
        </Text>
        <Text style={styles.bodyText}>
          {' '}
          Tag:{' '}
          {holdingInfo.tag === null || holdingInfo.tag.length === 0
            ? 'N/A'
            : holdingInfo.tag}{' '}
        </Text>
        <FormInput
          labelValue={updateNumShare}
          onChangeText={updateNumShareValue =>
            setUpdateNumShare(
              updateNumShareValue.length === 0 ? null : updateNumShareValue,
            )
          }
          placeholder={'Number of Shares'}
          autoCorrect={false}
        />
        <FormInput
          labelValue={updateAvgPrice}
          onChangeText={updateAvgPrice =>
            setUpdateAvgPrice(
              updateAvgPrice.length === 0 ? null : updateAvgPrice,
            )
          }
          placeholder={'Average Price'}
          autoCorrect={false}
        />
        <View>
          <RadioGroup
            radioButtons={radioButtons}
            onPress={onPressRadioButton}
            layout="row"
          />
        </View>
        <FormInput
          labelValue={updateTag}
          onChangeText={updateTag =>
            setUpdateTag(updateTag.length === 0 ? null : updateTag)
          }
          placeholder={'New Tag'}
          autoCorrect={false}
        />
        <FormButton
          buttonTitle="Save"
          disabledStatus={saveButtonStatus}
          onPress={() => {
            // Firebase.editAsset(getID, updateNumShare, updateTag);
            handleUpdate();
            // navigation.navigate('Plutus');
          }}
        />
        <FormButton
          buttonTitle="Delete Asset"
          onPress={() => {
            // Firebase.deleteAsset(getID);
            navigation.navigate('Plutus', {
              ticker: ticker,
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default EditAssetScreen;

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
    fontWeight: 'bold',
  },
  bodyText: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingBottom: 10,
    fontSize: 15,
  },
  mktValueText: {
    paddingBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
