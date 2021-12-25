import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import EditAssetScreen from '../screens/EditAssetScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Plutus"
        component={HomeScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="EditAsset"
        component={EditAssetScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={() => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
