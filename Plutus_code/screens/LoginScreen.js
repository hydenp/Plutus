import React, {useState, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const {login} = useContext(AuthContext);

  return (
    <View
      style={{
        // flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginTop: 120,
        alignItems: 'center',
      }}>
      <View style={[styles.container, styles.card]}>
        <Text style={styles.titleText}>Plutus</Text>
        <FormInput
          labelValue={email}
          onChangeText={userEmail => setEmail(userEmail)}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FormInput
          labelValue={password}
          onChangeText={userPassword => setPassword(userPassword)}
          placeholder="Password"
          secureTextEntry={true}
        />
        <FormButton
          buttonTitle="Sign In"
          onPress={() => login(email, password)}
        />
        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => navigation.navigate('Sign Up')}>
          <Text style={styles.navButtonText}>Create account</Text>
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
    paddingTop: 50,
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
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  titleText: {
    fontSize: 28,
    marginBottom: 20,
    color: '#051d5f',
    fontWeight: 'bold',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
  },
});
