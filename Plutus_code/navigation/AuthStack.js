/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

import  AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const AuthStack = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);
    let routeName;

    useEffect(() => {
        AsyncStorage.getItem('alreadyLaunched').then((value) => {
            if (value == null){
                AsyncStorage.setItem('alreadyLaunched', 'true');
                setIsFirstLaunch(true);
            } else {
                setIsFirstLaunch(false);
            }
        });
    }, []);

    if (isFirstLaunch === null) {
        return null;
    }
    else if (isFirstLaunch === true) {
        routeName = 'Login';
    }
    else {
        routeName = 'Login';
    }

    return (
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
    );
};

export default AuthStack;
