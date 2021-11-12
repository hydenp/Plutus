/* eslint-disable prettier/prettier */
import React, {useState, useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';

const HomeScreen = ({navigation}) => {

    return(
        <View>
            <Text> Home Screen </Text>
            <FormButton buttonTitle="Logout" onPress={() => {}} />
        </View>
    );
};

export default HomeScreen;

