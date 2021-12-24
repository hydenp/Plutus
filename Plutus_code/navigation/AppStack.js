import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import EditAssetScreen from '../screens/EditAssetScreen';
import {TouchableOpacity, Text} from 'react-native';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Plutus"
        // screenOptions={{headerShown: false}}
        component={HomeScreen}
        options={() => ({header: () => null})}
      />
      <Stack.Screen
        name="EditAsset"
        component={EditAssetScreen}
        options={() => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
