/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from "react";
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from "../screens/LoginScreen";

// import { AsyncStorage } from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const AuthStack = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);
    let routeName;

    // useEffect(() => {
    //     AsyncStorage.getItem('alreadyLaunched').then((value) => {
    //         if (value == null){
    //             AsyncStorage.setItem('alreadyLaunched', 'true');
    //             setIsFirstLaunch(true);
    //         } else {
    //             setIsFirstLaunch(false);
    //         }
    //     });
    // }, []);

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
        <Stack.Navigator initialRouteName={"Login"}>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{header: () => null}}
            />
        </Stack.Navigator>
    );
};

export default AuthStack;
