/* eslint-disable prettier/prettier */
import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const AppStack = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Plutus"
                component={HomeScreen}
                options={{header: () => null}}
            />
        </Stack.Navigator>
    )
};