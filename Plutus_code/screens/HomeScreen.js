/* eslint-disable prettier/prettier */
import React, {useState, useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';

const HomeScreen = ({navigation}) => {
     const {user, logout} = useContext(AuthContext); //get user info and data - to get user ID for example {user.uid}

    return(
        <View style={styles.container}>
            <Text> Home Screen </Text>
            <FormButton buttonTitle="Logout" onPress={() => logout()} />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      paddingTop: 50
    },
    logo: {
      height: 150,
      width: 150,
      resizeMode: 'cover',
    },
    text: {
      fontSize: 28,
      marginBottom: 10,
      color: '#051d5f',
    },
    navButton: {
      marginTop: 15,
    },
    forgotButton: {
      marginVertical: 35,
    },
    navButtonText: {
      fontSize: 18,
      fontWeight: '500',
      color: '#2e64e5',
    },
  });