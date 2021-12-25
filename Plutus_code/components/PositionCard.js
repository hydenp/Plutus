import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';

import HoldingCard from './HoldingCard';
import TickerInfo from '../utils/TickerInfo';
import formatter from '../utils/NumberFormatter';
import {AuthContext} from '../navigation/AuthProvider';
import Firebase from '../utils/Firebase';

const PositionCard = ({newHolding, resetFields, deletion, updates}) => {
  const {user, logout} = useContext(AuthContext);
  const [holdingList, setHoldingList] = useState([]);
  const [position, setPosition] = useState(0.0);
  const [refreshStatus, setRefreshStatus] = useState(false);

  const findTicker = ticker => {
    for (const key in holdingList) {
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

  const refreshList = () => {
    setRefreshStatus(true);
    getList();
  };

  const getList = () => {
    Firebase.fetchData(user).then(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const nextAsset = Firebase.createObject(doc);
        list.push(nextAsset);
      });
      setHoldingList(list);
      setRefreshStatus(false);
    });
  };

  // load list on component mount
  // empty dependency array
  useEffect(() => {
    getList();
  }, []);

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

  // watch for update prompt from edit screen passed through homescreen
  useEffect(() => {
    const {resetUpdate, tickerToUpdate} = updates;
    if (tickerToUpdate !== null) {
      const index = findTicker(tickerToUpdate.ticker);
      let newState = [...holdingList];
      newState[index] = Object.assign({}, newState[index], {
        ...tickerToUpdate,
      });
      setHoldingList(newState);
      resetUpdate();
    }
  }, [updates]);

  // update the total position
  const updatePosition = () => {
    let sum = 0;
    for (const key in holdingList) {
      sum +=
        parseFloat(holdingList[key].currPrice) *
        parseFloat(holdingList[key].numShares);
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

  // update prices when list is loaded
  useEffect(() => {
    if (refreshStatus === false) {
      updatePrices();
    }
  }, [refreshStatus]);

  // update the position whenever the list if changed
  useEffect(() => {
    updatePosition();
  }, [holdingList]);

  useEffect(() => {}, [holdingList.length]);

  const renderItem = ({item}) => <HoldingCard key={item.id} data={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.position}>
        <Text style={styles.positionFont}>Position </Text>
        <Text style={styles.positionFont}>{formatter.format(position)}</Text>
      </View>

      {/*Render the list of Holdings*/}
      <FlatList
        style={styles.flatList}
        data={holdingList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshing={refreshStatus}
        onRefresh={refreshList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default PositionCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    flexDirection: 'column',
    width: '100%',
    color: 'white',
    borderRadius: 5,
  },
  position: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  flatList: {
    // flexGrow: 0,
    height: '100%',
  },
  positionFont: {
    fontWeight: 'bold',
    fontSize: 25,
  },
});
