import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';

import HoldingCard from './HoldingCard';
import TickerInfo from '../utils/TickerInfo';
import formatter from '../utils/NumberFormatter';
import {AuthContext} from '../navigation/AuthProvider';
import Firebase from '../utils/Firebase';

const PositionCard = () => {
  const {user, logout} = useContext(AuthContext);
  const [holdingList, setHoldingList] = useState([]);
  const [position, setPosition] = useState(0.0);

  useEffect(() => {
    Firebase.fetchData(user).then(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const nextAsset = Firebase.createObject(doc);
        list.push(nextAsset);
      });
      setHoldingList(list);
      console.log(holdingList);
    });
  }, [user]);

  // updatePosition = () => {
  //   let sum = 0;
  //   for (const key in this.state.holdings) {
  //     if (typeof this.state.holdings[key].currPrice === 'number') {
  //       sum +=
  //         this.state.holdings[key].currPrice *
  //         // eslint-disable-next-line radix
  //         parseInt(this.state.holdings[key].numShare);
  //     }
  //   }
  //   this.setState({
  //     position: sum,
  //   });
  // };

  // updatePrices = () => {
  //   for (const key in this.state.holdings) {
  //     TickerInfo.getData(this.state.holdings[key].ticker)
  //       .then(res => {
  //         let items = [...this.state.holdings];
  //         let item = {...items[key]};
  //         item.currPrice = res.data.c;
  //         items[key] = item;
  //         this.setState({holdings: items}, () => this.updatePosition());
  //       })
  //       .catch(error => {
  //         console.log('price call failed with: ' + error);
  //       });
  //   }
  // };

  // checkUpdate = newList => {
  //   for (const key in this.state.holdings) {
  //     if (
  //       this.state.holdings[key].numShare !== newList[key].numShare ||
  //       this.state.holdings[key].avgPrice !== newList[key].avgPrice
  //     ) {
  //       let items = [...this.state.holdings];
  //       let updatedItem = {...this.state.holdings[key]};
  //       updatedItem.numShare = newList[key].numShare;
  //       updatedItem.avgPrice = newList[key].avgPrice;
  //       items[key] = updatedItem;
  //       this.setState(
  //         {
  //           holdings: items,
  //         },
  //         () => {
  //           this.updatePosition();
  //         },
  //       );
  //     }
  //   }
  // };

  // OBSERVER
  // this React hook listens for changes to the props
  // when changes are made, this function updates
  // when that happens, all child HoldingCards update their values
  // componentDidUpdate = props => {
  //   if (this.state.holdings !== null) {
  //     if (this.state.holdings.length !== props.holdingList.length) {
  //       // eslint-disable-next-line react/no-did-update-set-state
  //       this.setState(
  //         {
  //           holdings: props.holdingList,
  //         },
  //         () => {
  //           this.updatePrices();
  //           // this.updatePosition();
  //         },
  //       );
  //       // if the list size did not change but something was updated
  //       // a number of shares should be updated
  //     } else {
  //       this.checkUpdate(props.holdingList);
  //     }
  //   } else {
  //     // eslint-disable-next-line react/no-did-update-set-state
  //     this.setState(
  //       {
  //         holdings: props.holdingList,
  //       },
  //       () => {
  //         this.updatePrices();
  //       },
  //     );
  //   }
  // };
  //
  // // function to call update prices every 15 seconds
  // yourFunction = () => {
  //   this.updatePrices();
  //   setTimeout(this.yourFunction, 15000);
  // };

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
