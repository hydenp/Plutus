import React, {Component} from 'react';
import {useState, useEffect} from 'react';

import {StyleSheet, View, Text, SafeAreaView, FlatList} from 'react-native';
// import { block } from 'react-native-reanimated';
import HoldingCard from './HoldingCard';
import TickerInfo from '../utils/TickerInfo';

// const PositionCard = ({holdingList}) => {
//   const [holdings, setHoldings] = useState(holdingList);
//   // console.log(holdingList);
//
//   useEffect(() => {
//     console.log('HI hyden');
//     console.log(holdingList);
//     // const test = ['test', 'hyden', 'hello'];
//     // setHoldings(test);
//   }, [holdings]);
//
//   return (
//     //   {holdings.map((holding, key) => (
//     //     <HoldingCard
//     //       key={key}
//     //       ticker={holding.ticker}
//     //       numShares={holding.numShare}
//     //     />
//     //   ))}
//     //   ;
//       <View style={[styles.container, styles.shadow]}>
//         <Text>Hi Hyden</Text>
//
//         {/*{this.state.holdings.map(function (d, idx) {*/}
//         {/*  // return <HoldingCard key={idx} data={d} />;*/}
//         {/*  // return <Text key={idx}> Hi Hyden</Text>;*/}
//         {/*  return <Text> Hi Hyden </Text>;*/}
//         {/*})}*/}
//       </View>
//   );
//   // <SafeAreaView style={{...styles.container, ...styles.shadow}}>
//   //   <View style={styles.container}>
//   //     <Text>Card Title {ticker}</Text>
//   //     {/* <HoldingCard holding={holdings} />
//   //     <HoldingCard holding={holdings} /> */}
//   //   </View>
//   // </SafeAreaView>
// };

class PositionCard extends Component {
  state = {
    position: 0,
    data: null,
    // holdings: [{id: 1, ticker: 'AAPL'}],
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
      position: Math.round(sum * 100) / 100,
    });
    console.log('position = ');
    console.log(this.state.position);
  };

  updatePrices = () => {
    console.log('trynna update prices');
    console.log(this.state.holdings);
    for (const key in this.state.holdings) {
      // console.log('key = ' + key);
      // console.log('getting price');
      // console.log("ticker = " + this.state.holdings[key].ticker);
      TickerInfo.getData(this.state.holdings[key].ticker)
        .then(res => {
          // console.log(res.data);
          // this.state.holdings[key].currPrice = res.data.c;
          // this.setState();
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

  componentDidUpdate = props => {
    console.log("hello from update");
    // console.log(props);
    if (this.state.holdings !== null) {
      if (this.state.holdings.length !== props.holdingList.length) {
        this.setState(
          {
            holdings: props.holdingList,
          },
          () => {
            this.updatePrices();
            // this.updatePosition();
          },
        );
      }
    } else {
      this.setState(
        {
          holdings: props.holdingList,
        },
        () => {
          this.updatePrices();
          // this.updatePosition();
        },
      );
    }
  };

  yourFunction = () => {
    // do whatever you like here

    console.log("hello!");
    this.updatePrices();

    setTimeout(this.yourFunction, 5000);
  };

  printHoldings() {
    for (const key in this.state.holdings) {
      // console.log('key = ' + key);
      console.log(this.state.holdings[key]);
    }
  }

  renderItem = ({item}) => <HoldingCard key={item.id} data={item} />;

  render() {
    return (
      <View style={[styles.container, styles.shadow]}>
        <Text>Hi Hyden</Text>
        <Text>${this.state.position}</Text>

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
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 'auto',
    color: 'white',
    borderRadius: 5,
    dropShadow: 5,
  },
  shadow: {
    borderWidth: 1,
    borderColor: 'black',
  },
});
