import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';

import HoldingCard from './HoldingCard';
import TickerInfo from '../utils/TickerInfo';
import formatter from '../utils/NumberFormatter';
import {AuthContext} from '../navigation/AuthProvider';
import Firebase from '../utils/Firebase';

const PositionCard = ({newHolding, resetFields, deletion}) => {
  const {user, logout} = useContext(AuthContext);
  const [holdingList, setHoldingList] = useState([]);
  const [position, setPosition] = useState(0.0);

  const findTicker = ticker => {
    for (const key in holdingList) {
      console.log(holdingList[key].ticker);
      console.log(key);
      if (holdingList[key].ticker === ticker) {
        return key;
      }
    }
    return -1;
  };

  // when new asset is added
  useEffect(() => {
    let duplicate = false;
    for (const key in holdingList) {
      if (holdingList[key].ticker === newHolding.ticker) {
        duplicate = true;
      }
    }

    if (duplicate) {
      // notify the user holding already exists
      alert(
        'You already have this Ticker. You can edit your holding by tapping it',
      );
      resetFields();
    } else {
      // make sure fields not blank
      if (newHolding.submit) {
        console.log('adding new asset');

        // add to the holding list
        setHoldingList([...holdingList, newHolding]);
        resetFields();

        Firebase.addAssets(user, newHolding)
          .then(console.log('asset successfully added to firebase'))
          .catch(e => {
            console.log('failed to add asset with error: ' + e);
          });
      }
    }
  }, [newHolding.submit]);

  // load list on component mount
  // empty dependency array
  useEffect(() => {
    Firebase.fetchData(user).then(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const nextAsset = Firebase.createObject(doc);
        list.push(nextAsset);
      });
      setHoldingList(list);
    });
  }, []);

  const handleDelete = (userID, ticker) => {
    const idx = findTicker(ticker);
    const newList = holdingList.splice(idx, 1);
    setHoldingList(newList);
  };

  // watch for deletion prompt
  useEffect(() => {
    const {resetDelete, tickerToDelete} = deletion;
    if (tickerToDelete != null) {
      const index = findTicker(tickerToDelete);
      let currHoldings = [...holdingList];
      currHoldings.splice(index, 1);
      setHoldingList(currHoldings);
      resetDelete();
    }
  }, [deletion.tickerToDelete]);

  const updatePosition = () => {
    let sum = 0;
    for (const key in holdingList) {
      sum +=
        holdingList[key].currPrice *
        // eslint-disable-next-line radix
        parseInt(holdingList[key].numShare);
    }
    setPosition(sum);
  };

  const updatePrices = () => {
    for (const key in holdingList) {
      TickerInfo.getData(holdingList[key].ticker)
        .then(res => {
          let items = [...holdingList];
          let item = items[key];
          item.currPrice = res.data.c;
          items[key] = item;
          setHoldingList(items);
        })
        .catch(error => {
          console.log('price call failed with: ' + error);
        });
    }
  };

  useEffect(() => {
    updatePrices();
  }, [holdingList.length]);

  const renderItem = ({item}) => <HoldingCard key={item.id} data={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.position}>
        <Text style={styles.positionFont}>Hi Name </Text>
        <Text style={styles.positionFont}>{formatter.format(position)}</Text>
      </View>

      {/*Render the list of Holdings*/}
      <FlatList
        data={holdingList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default PositionCard;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'column',
    width: '100%',
    height: '80%',
    color: 'white',
    borderRadius: 5,
    dropShadow: 5,
  },
  position: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  positionFont: {
    fontWeight: 'bold',
    fontSize: 25,
  },
});
