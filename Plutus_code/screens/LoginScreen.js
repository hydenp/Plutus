import React, {useState, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';
import {globalStyles} from '../utils/Styles';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const {login} = useContext(AuthContext);

  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginTop: 150,
        alignItems: 'center',
      }}>
      <Text style={styles.titleText}>Welcome to</Text>
      <Text style={[styles.titleText, {fontWeight: 'bold'}]}>Plutus</Text>
      <View style={[styles.container, globalStyles.card]}>
        <Text
          style={[
            styles.titleText,
            {fontSize: 18, marginVertical: 10, textAlign: 'center'},
          ]}>
          Enter your Credentials
        </Text>
        <FormInput
          labelValue={email}
          onChangeText={userEmail => setEmail(userEmail)}
          placeholder="Email"
          keyboardType="email-address"
          aautoCapitalize="none"
          secureTextEntry={false}
          autoCorrect={false}
        />
        <FormInput
          labelValue={password}
          onChangeText={userPassword => setPassword(userPassword)}
          placeholder="Password"
          secureTextEntry={true}
        />
        <FormButton
          buttonTitle="Login"
          onPress={() => login(email, password)}
        />
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.createAccountButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 20,
    margin: 30,
  },
  card: {
    borderRadius: 20,
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  titleText: {
    fontSize: 28,
  },
  navButton: {
    marginTop: 15,
  },
  createAccountButton: {
    marginVertical: 15,
    color: '#37C87A',
  },
  createAccountButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#37C87A',
  },
});
