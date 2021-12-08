/* eslint-disable prettier/prettier */
import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import EditAssetScreen from '../screens/EditAssetScreen';

const Stack = createStackNavigator();

const AppStack = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="Plutus"
                component={HomeScreen}
                options={{header: () => null}}
            />
            <Stack.Screen
                name="EditAsset"
                component={EditAssetScreen}
                options={({navigation}) => ({
                    title: '',
                    headerStyle: {
                        backgroundColor: '#f9fafd', //CHANGE THIS LATER, SELECT SAME COLOR AS BACKGROUND
                        shadowColor: '#f9fafd', //CHANGE THIS LATER, SELECT SAME COLOR AS BACKGROUND
                        elevation: 0,
                    },
                })}
            />
        </Stack.Navigator>
    )
};

export default AppStack;