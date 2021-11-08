/* eslint-disable prettier/prettier */
import 'react-native-gesture-handler';
import React, { useContext, useState, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AuthStack from './AuthStack';
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from '../screens/SignupScreen';

const Stack = createStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{header: () => null}}
                />
                <Stack.Screen
                    name="Signup"
                    component={SignupScreen}
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
        </NavigationContainer>
    );
};

export default Routes;
