import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
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
  const [investmentROI, setInvestmentROI] = useState(null);

  const [saveButtonStatus, setSaveButtonStatus] = useState(true);
  const radioButtonsData = [
    {
      id: '1',
      label: 'Overwrite',
      value: 'option1',
      color: '#DDDDDD',
      selected: true,
    },
    {
      id: '2',
      label: 'Add',
      value: 'option2',
      color: '#DDDDDD',
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
      let payload = {
        ...(updateNumShare !== null && {numShares: parseFloat(updateNumShare)}),
        ...(updateAvgPrice !== null && {avgPrice: parseFloat(updateAvgPrice)}),
        ...(updateTag !== null && {tag: updateTag.toUpperCase()}),
      };

      if (radioButtons[0].selected === true) {
        console.log('overwrite!');
        if (updateAvgPrice === null && updateTag === null) {
          payload.avgPrice = null;
        }
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

  const calcRIO = () => {
    let avgPrice;
    if (updateInfo !== null) {
      avgPrice =
        updateInfo.hasOwnProperty('avgPrice') !== false
          ? updateInfo.avgPrice
          : route.params.avgPrice;
    } else {
      avgPrice = route.params.avgPrice;
    }
    return (
      (parseFloat(route.params.price) - parseFloat(avgPrice)) /
      parseFloat(route.params.price)
    );
  };

  useEffect(() => {
    //  ROI = net return / cost
    setInvestmentROI(calcRIO() * 100);
  }, [updateAvgPrice, updateNumShare, route.params, updateInfo]);

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
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={[styles.container, globalStyles.card, {margin: 20}]}>
        <Text style={styles.titleText}>{holdingInfo.ticker}</Text>
        <View style={styles.assetInfoContainer}>
          <ScrollView
            style={styles.scrollStyle}
            showsVerticalScrollIndicator={false}>
            <View style={styles.infoContainer}>
              <Text style={[styles.bodyText, {textAlign: 'left'}]}>
                Holding Market Value
              </Text>
              <Text style={[styles.bodyText, {textAlign: 'right'}]}>
                {formatter.format(holdingInfo.price * holdingInfo.numShares)}
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={[styles.bodyText, {textAlign: 'left'}]}>
                Average Price
              </Text>
              <Text style={[styles.bodyText, {textAlign: 'right'}]}>
                {holdingInfo.avgPrice === null
                  ? 'N/A'
                  : formatter.format(holdingInfo.avgPrice)}
              </Text>
            </View>
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
              <Text style={[styles.bodyText, {textAlign: 'left'}]}>ROI</Text>
              <Text style={[styles.bodyText, {textAlign: 'right'}]}>
                {!isNaN(investmentROI)
                  ? parseFloat(investmentROI).toFixed(2) + '%'
                  : 'N/A'}
              </Text>
            </View>
            <View style={[styles.infoContainer, {paddingBottom: 20}]}>
              <Text style={[styles.bodyText, {textAlign: 'left'}]}>Tag</Text>
              <Text style={[styles.bodyText, {textAlign: 'right'}]}>
                {holdingInfo.tag === null || holdingInfo.tag.length === 0
                  ? 'N/A'
                  : holdingInfo.tag}{' '}
              </Text>
            </View>
          </ScrollView>
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
    padding: 15,
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
  assetInfoContainer: {
    height: 170,
    width: '100%',
    borderRadius: 8,
    padding: 10,
    paddingBottom: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
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
  scrollStyle: {
    paddingHorizontal: 5,
  },
  infoContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bodyText: {
    width: '50%',
    margin: 2,
    // paddingBottom: 5,
    padding: 3,
    fontSize: 15,
  },
});
