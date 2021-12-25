import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';
import {globalStyles} from '../utils/Styles';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

import Firebase from '../utils/Firebase';
import formatter from '../utils/NumberFormatter';
import {AuthContext} from '../navigation/AuthProvider';
import {blue} from 'react-native-reanimated/src/reanimated2/Colors';

const EditAssetScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);

  const [holdingInfo, setHoldingInfo] = useState(route.params);
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
      color: '#DDDDDD',
      // color: '#333',
      selected: true,
    },
    {
      id: '2',
      label: 'Add',
      value: 'option2',
      color: '#DDDDDD',
      // color: '#333',
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
    if (isNaN(updateNumShare) || isNaN(updateAvgPrice)) {
      alert(
        'Please enter numeric values for the Number of Shares and Average Price',
      );
    } else {
      const payload = {
        ...(updateNumShare !== null && {numShares: parseFloat(updateNumShare)}),
        ...(updateAvgPrice !== null && {avgPrice: parseFloat(updateAvgPrice)}),
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
          Firebase.updateAsset(user, holdingInfo.ticker, payload);
        }
      }
      payload.ticker = holdingInfo.ticker;
      setUpdateInfo(payload);
    }
  };

  // update saved button depending on what info is entered
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
        style={[
          styles.backButton,
          globalStyles.card,
          {borderRadius: 8, shadowOpacity: 0.1},
        ]}
        onPress={() =>
          navigation.navigate('Plutus', {
            updateInfo: updateInfo === null ? null : updateInfo,
          })
        }>
        <Text style={styles.backButtonText}> Back</Text>
      </TouchableOpacity>
      <View style={[styles.container, globalStyles.card, {margin: 20}]}>
        <Text style={styles.titleText}> {holdingInfo.ticker} </Text>
        <Text style={styles.mktValueText}>
          {' '}
          Market Value:{' '}
          {formatter.format(holdingInfo.price * holdingInfo.numShares)}{' '}
        </Text>
        <View style={styles.updateAssetContainer}>
          <View style={styles.infoContainer}>
            <Text style={[styles.bodyText, {textAlign: 'left'}]}>
              Number of Shares
            </Text>
            <Text style={[styles.bodyText, {textAlign: 'right'}]}>
              {holdingInfo.numShares}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.bodyText, {textAlign: 'left'}]}>
              Current Price
            </Text>
            <Text style={[styles.bodyText, {textAlign: 'right'}]}>
              {formatter.format(holdingInfo.price)}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.bodyText, {textAlign: 'left'}]}>Tag</Text>
            <Text style={[styles.bodyText, {textAlign: 'right'}]}>
              {holdingInfo.tag === null || holdingInfo.tag.length === 0
                ? 'N/A'
                : holdingInfo.tag}{' '}
            </Text>
          </View>
        </View>

        <View style={styles.updateAssetContainer}>
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
          buttonTitle="Save Changes"
          disabledStatus={saveButtonStatus}
          onPress={() => {
            handleUpdate();
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
    paddingTop: 25,
  },
  backButton: {
    borderRadius: 8,
    marginLeft: 20,
    padding: 10,
    width: '17%',
    height: 'auto',
    backgroundColor: '#DDDDDD',
  },
  backButtonText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
  titleText: {
    paddingBottom: 15,
    fontSize: 25,
    fontWeight: 'bold',
  },
  updateAssetContainer: {
    width: '100%',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
  },
  infoContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  bodyText: {
    // textAlign: 'center',
    width: '50%',
    // backgroundColor: 'green',
    margin: 2,
    // alignItems: 'flex-start',
    paddingBottom: 10,
    fontSize: 15,
  },
  mktValueText: {
    paddingBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
