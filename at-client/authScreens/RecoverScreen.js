import React from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';

import io from 'socket.io-client/dist/socket.io';
window.navigator.userAgent='react-native';
import { getUrl } from '../utils';

export default class RecoverScreen extends React.Component {

  constructor() {
    super();

    this.state = {
      screenUserName: '',
      error: '',
    };

    this.socket = io.connect(getUrl('/authentication'), {reconnect: true});
  };

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>

        <TextInput
          placeholder="username or email"
          returnKeyType="next"
          onSubmitEditing={()=>this.passwordInput.focus()}
          keyboardType="email-address"
          onChangeText={(text) => this.setState({ screenUserName: text })}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress= {this._forgotPasswordAsync}>
          <Text style={styles.buttonText}> Get Recovery Email </Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    );
  }

  _forgotPasswordAsync = async () => {
    console.log('resetting password', this.state.screenUserName);
    const username = this.state.screenUserName;
    this.socket.emit('reset-password-request', {
      email: this.state.screenUserName,
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5DC',
  },
  input: {
    height:40,
    backgroundColor:'rgba(255,255,255,0.2)',
    marginBottom: 20,
    color:'#2980b9',
    paddingHorizontal:10,
  },
  buttonContainer:{
    backgroundColor:'#000000',
    paddingVertical:15,
    paddingHorizontal:20,
    marginBottom: 20,
  },
  buttonText:{
    textAlign:'center',
    color: '#FFFFFF',
    fontWeight:'700',
    paddingHorizontal:20,
  },
});
