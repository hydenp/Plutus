import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';
import {globalStyles} from '../utils/styles';

const SignupScreen = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const {register} = useContext(AuthContext);

  return (
    // <View style={styles.container}>
    //   <Text style={styles.text}>Create an account</Text>
    //   <FormInput
    //     labelValue={email}
    //     onChangeText={userEmail => setEmail(userEmail)}
    //     placeholder="Enter an e-mail"
    //     keyboardType="email-address"
    //     autoCapitalize="none"
    //     autoCorrect={false}
    //   />
    //   <FormInput
    //     labelValue={password}
    //     onChangeText={userPassword => setPassword(userPassword)}
    //     placeholder="Enter Password"
    //     secureTextEntry={true}
    //   />
    //   <FormButton
    //     buttonTitle="Sign Up"
    //     onPress={() => register(email, password)}
    //   />
    // </View>

    <View
      style={{
        // flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginTop: 120,
        alignItems: 'center',
      }}>
      <View style={[styles.container, globalStyles.card]}>
        <Text style={styles.text}>Create an account</Text>
        <FormInput
          labelValue={email}
          onChangeText={userEmail => setEmail(userEmail)}
          placeholder="Enter an Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FormInput
          labelValue={password}
          onChangeText={userPassword => setPassword(userPassword)}
          placeholder="Enter a Password"
          secureTextEntry={true}
        />
        <FormButton
          buttonTitle="Sign Up"
          onPress={() => register(email, password)}
        />
      </View>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 20,
    paddingTop: 50,
    margin: 20,
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
