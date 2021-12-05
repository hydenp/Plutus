import React, {Component} from 'react';
import {useState, useEffect} from 'react';

import {StyleSheet, View, Text, SafeAreaView, Flatlist} from 'react-native';
// import { block } from 'react-native-reanimated';
import HoldingCard from './HoldingCard';
import TickerInfo from '../utils/TickerInfo';

// const PositionCard = ({holdingList}) => {
//   const [holdings, setHoldings] = useState(holdingList);
//   // console.log(holdingList);
//
//   useEffect(() => {
//     console.log('HI hyden');
//     console.log(holdings);
//     const test = ['test', 'hyden', 'hello'];
//     setHoldings(test);
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
    holdings: ['hello', 'world'],
  };

  constructor(props) {
    super();
    this.state = {
      holdings: props.holdingList,
    };
    // console.log(this.state);

    // this.printHoldings = this.printHoldings.bind(this);
    // this.updatePrices = this.updatePrices.bind(this);
    // this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }

  updatePrices = () => {
    console.log('trynna update prices');
    console.log(this.state.holdings);
    for (const key in this.state.holdings) {
      console.log('key = ' + key);
      console.log('getting price');
      TickerInfo.getData(this.state.holdings[key].ticker).then(res => {
        this.state.holdings[key].currPrice = res.data.c;
      });
    }
  };

  componentDidUpdate = props => {
    if (this.state.holdings.length !== props.holdingList.length) {
      // console.log('currenstate');
      // console.log(this.state);
      console.log('updating holdings');
      // console.log(props.holdingList);
      this.state.holdings = props.holdingList;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState();
      // this.setState({holdings: props.holdingList});
      console.log(this.state.holdings);
      this.updatePrices();
    }
  };

  printHoldings() {
    for (const key in this.state.holdings) {
      // console.log('key = ' + key);
      console.log(this.state.holdings[key]);
    }
  }

  render() {
    return (
      <View style={[styles.container, styles.shadow]}>
        <Text>Hi Hyden</Text>

        {this.state.holdings.map(function (d, idx) {
          return <HoldingCard key={idx} data={d} />;
          // return <Text key={idx}> Hi Hyden</Text>;
          // return <Text> Hi Hyden </Text>;
        })}
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
