import React, {Component} from 'react';
import {Dropdown} from 'react-native-material-dropdown';

class DropDown extends Component {
  render() {
    let data = [
      {
        value: 'Stock',
      },
      {
        value: 'REITs',
      },
      {
        value: 'Bonds',
      },
    ];

    return <Dropdown label="Select a type" data={data} />;
  }
}

export default DropDown;
