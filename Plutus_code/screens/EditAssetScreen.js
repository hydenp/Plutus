import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import RadioGroup from 'react-native-radio-buttons-group';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

import Firebase from '../utils/Firebase';
import formatter from '../utils/NumberFormatter';
import {AuthContext} from '../navigation/AuthProvider';

const EditAssetScreen = ({navigation, route}) => {
  // const navigation = useNavigation();

  const {user} = useContext(AuthContext);

  const [holdingInfo, setHoldingInfo] = useState(route.params);

  // console.log('****************************************');
  // console.log(route.params);
  // console.log('****************************************');

  const [updateNumShare, setUpdateNumShare] = useState(null);
  const [updateAvgPrice, setUpdateAvgPrice] = useState(null);
  const [updateTag, setUpdateTag] = useState(null);
  const [updateInfo, setUpdateInfo] = useState(null);

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
        // eslint-disable-next-line no-alert
        alert('Please provide an average price for the new number of shares');
      } else {
        // calculate the new avg price
        payload.avgPrice =
          (parseFloat(holdingInfo.numShares) *
            parseFloat(holdingInfo.avgPrice) +
            parseFloat(updateAvgPrice) * parseFloat(updateNumShare)) /
          (parseFloat(holdingInfo.numShares) + parseFloat(updateNumShare));
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
    payload.ticker = holdingInfo.ticker;
    setUpdateInfo(payload);
  };

  useEffect(() => {
    // when overwrite selected
    if (radioButtons[0].selected === true) {
      if (updateNumShare !== null || updateTag !== null) {
        setSaveButtonStatus(false);
      } else {
        setSaveButtonStatus(true);
      }
      // when add is selected
    } else {
      if (
        (updateNumShare !== null && updateAvgPrice !== null) ||
        (updateNumShare == null && updateAvgPrice == null && updateTag !== null)
      ) {
        setSaveButtonStatus(false);
      } else {
        setSaveButtonStatus(true);
      }
    }
  }, [updateNumShare, updateAvgPrice, updateTag, radioButtons]);

  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Plutus', {
            updateInfo: updateInfo === null ? null : updateInfo,
          })
        }>
        <Text>Back</Text>
      </TouchableOpacity>
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
            handleUpdate();
            // navigation.navigate('Plutus');
          }}
        />
        <FormButton
          buttonTitle="Delete Asset"
          onPress={() => {
            navigation.navigate('Plutus', {
              ticker: holdingInfo.ticker,
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
