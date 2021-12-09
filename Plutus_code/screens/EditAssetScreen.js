import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

import Firebase from '../utils/Firebase';
import formatter from '../utils/NumberFormatter';

const EditAssetScreen = ({route}) => {
  const navigation = useNavigation();

  const {getTicker, getShares, getPrice, getID, getTag} = route.params;

  const [updateNumShare, setUpdateNumShare] = useState(null);
  const [updateTag, setUpdateTag] = useState(null);
  const totalValue = getShares * getPrice;

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.titleText}> {getTicker} </Text>
        <Text style={styles.mktValueText}>
          {' '}
          Market Value: {formatter.format(totalValue)}{' '}
        </Text>
        <Text style={styles.bodyText}> Number shares: {getShares} </Text>
        <Text style={styles.bodyText}>
          {' '}
          Current Price: {formatter.format(getPrice)}{' '}
        </Text>
        <Text style={styles.bodyText}> Tag: {getTag} </Text>
        <FormInput
          labelValue={updateNumShare}
          onChangeText={updateNumShareValue =>
            setUpdateNumShare(updateNumShareValue)
          }
          placeholder={'Change shares'}
          autoCorrect={false}
        />
        <FormInput
          labelValue={updateTag}
          onChangeText={setUpdateTagValue => setUpdateTag(setUpdateTagValue)}
          placeholder={'Change Tag'}
          autoCorrect={false}
        />
        <FormButton
          buttonTitle="Save"
          onPress={() => {
            Firebase.editAsset(getID, updateNumShare, updateTag);
            navigation.navigate('Plutus');
          }}
        />
        <FormButton
          buttonTitle="Delete Asset"
          onPress={() => {
            Firebase.deleteAsset(getID);
            navigation.navigate('Plutus');
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
