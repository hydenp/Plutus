import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';

import HoldingCard from './HoldingCard';
import TickerInfo from '../utils/TickerInfo';
import formatter from '../utils/NumberFormatter';
class PositionCard extends Component {
  state = {
    position: 0,
    data: null,
    holdings: null,
  };

  constructor() {
    super();
    // this.yourFunction();
  }

  updatePosition = () => {
    let sum = 0;
    for (const key in this.state.holdings) {
      if (typeof this.state.holdings[key].currPrice === 'number') {
        sum +=
          this.state.holdings[key].currPrice *
          // eslint-disable-next-line radix
          parseInt(this.state.holdings[key].numShare);
      }
    }
    this.setState({
      position: sum,
    });
  };

  updatePrices = () => {
    for (const key in this.state.holdings) {
      TickerInfo.getData(this.state.holdings[key].ticker)
        .then(res => {
          console.log(this.state);
          let items = [...this.state.holdings];
          let item = {...items[key]};
          item.currPrice = res.data.c;
          items[key] = item;
          this.setState({holdings: items}, () => this.updatePosition());
        })
        .catch(error => {
          console.log('price call failed with: ' + error);
        });
    }
  };

  checkUpdate = newList => {
    for (const key in this.state.holdings) {
      if (
        this.state.holdings[key].numShare !== newList[key].numShare ||
        this.state.holdings[key].avgPrice !== newList[key].avgPrice
      ) {
        console.log('updating something');
        let items = [...this.state.holdings];
        let updatedItem = {...this.state.holdings[key]};
        updatedItem.numShare = newList[key].numShare;
        updatedItem.avgPrice = newList[key].avgPrice;
        items[key] = updatedItem;
        this.setState(
          {
            holdings: items,
          },
          () => {
            this.updatePosition();
          },
        );
      }
    }
  };

  componentDidUpdate = props => {
    console.log('hello from update');
    console.log(props.holdingList);
    if (this.state.holdings !== null) {
      if (this.state.holdings.length !== props.holdingList.length) {
        this.setState(
          {
            holdings: props.holdingList,
          },
          () => {
            this.updatePrices();
          },
        );
        // if the list size did not change but something was updated
        // a number of shares should be updated
      } else {
        this.checkUpdate(props.holdingList);
      }
    } else {
      this.setState(
        {
          holdings: props.holdingList,
        },
        () => {
          this.updatePrices();
        },
      );
    }
  };

  yourFunction = () => {
    // do whatever you like here
    this.updatePrices();

    setTimeout(this.yourFunction, 5000);
  };

  renderItem = ({item}) => <HoldingCard key={item.id} data={item} />;

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.position}>
          <Text style={styles.positionFont}>Hi Hyden  </Text>
          <Text style={styles.positionFont}>
            {formatter.format(this.state.position)}
          </Text>
        </View>

        {/*Render the list of Holdings*/}
        <FlatList
          data={this.state.holdings}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}

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
