import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Button
} from 'react-native';
import { SecureStore } from 'expo';

import io from 'socket.io-client/dist/socket.io';
window.navigator.userAgent='react-native';

import { getUrl } from '../utils';

export default class SignupScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      screenFirstName: '',
      screenLastName: '',
      screenBusinessName: '',
      screenUserName: '',
      screenPassword: '',
      error: ''
    };

    this.socket = io.connect(getUrl('/authentication'), {reconnect: true});
  };


  _signUpAsync = async () => {

    //sign up request comes here.
    await this.socket.emit('signUp', {
      screenFirstName: this.state.screenFirstName,
      screenLastName: this.state.screenLastName,
      screenBusinessName: this.state.screenBusinessName,
      screenUserName: this.state.screenUserName,
      screenPassword: this.state.screenPassword,
      screenEmail: this.state.screenEmail,
    }); // emit an event to the socket

    await this.socket.on('loginStatus', async(data)=>{
    console.log("2");


    if (data.status == "username already exists") {
      this.setState({error:"username already exists. Try another!"});
    }
    else {
      console.log("3");

      await SecureStore.setItemAsync('usernameToken',this.state.screenUserName);

      if (this.state.screenBusinessName == "ContentCreator") {
        this.props.navigation.navigate('ContentCreatorApp');
      }
      else if (this.state.screenBusinessName == "Core") {
        this.props.navigation.navigate('CoreApp');
      }
      else if (this.state.screenBusinessName == "Designer") {
        this.props.navigation.navigate('DesignerApp');
      }
      else if (this.state.screenBusinessName == "Coordination") {
        this.props.navigation.navigate('CoordinationApp');
      }
      else if (this.state.screenBusinessName == "God") {
        this.props.navigation.navigate('GodApp');
      }
      else if (this.state.screenBusinessName == "Photographer") {
        this.props.navigation.navigate('PhotographerApp');
      }
      else if (this.state.screenBusinessName == "Ad") {
        this.props.navigation.navigate('AdApp');
      }
      else {
        this.props.navigation.navigate('Package');
      }
    }
  });


  //setting the state so that the user stays signed in after logging in.

};


    render() {
      return (

        <KeyboardAvoidingView behavior="padding" style={styles.container}>

        <Text style={styles.Welcome}> Welcome to @</Text>

        <Text style={styles.loginText}> Quickly Sign Up! </Text>

        <Text style={styles.errorText}>{this.state.error}</Text>

            <TextInput
            placeholder="first name"
              returnKeyType="next"
              onSubmitEditing={()=>this.LastNameInput.focus()}
              keyboardType="email-address"
              onChangeText={(text) => this.setState({screenFirstName:text})}

              style={styles.input}

              />

              <TextInput
              placeholder="last name"
                returnKeyType="next"
                ref={(input)=>this.lastNameInput=input}
                onSubmitEditing={()=>this.businessNameInput.focus()}
                keyboardType="email-address"
                onChangeText={(text) => this.setState({screenLastName:text})}

                style={styles.input}

                />

                <TextInput
                placeholder="business name"
                  returnKeyType="next"
                  ref={(input)=>this.businessNameInput=input}
                  onSubmitEditing={()=>this.usernameInput.focus()}
                  keyboardType="email-address"
                  onChangeText={(text) => this.setState({screenBusinessName:text})}

                  style={styles.input}
                  />



            <TextInput
              placeholder="username"
              returnKeyType="next"
              ref={(input)=>this.usernameInput=input}
              onSubmitEditing={()=>this.emailInput.focus()}
              keyboardType="email-address"
              style={styles.input}

              onChangeText={(text) => this.setState({screenUserName:text})}

              />

            <TextInput
              placeholder="email"
              returnKeyType="next"
              ref={(input)=>this.emailInput=input}
              onSubmitEditing={()=>this.passwordInput.focus()}
              keyboardType="email-address"
              style={styles.input}

              onChangeText={(text) => this.setState({screenEmail:text})}

              />


            <TextInput
                placeholder="password"
                returnKeyType="go"
                secureTextEntry
                ref={(input)=>this.passwordInput=input}
                onChangeText={(text) => this.setState({screenPassword:text})}

                style={styles.input}
                />


            <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this._signUpAsync}
            >

              <Text style={styles.buttonText}> Sign Up  </Text>
              </TouchableOpacity>


        </KeyboardAvoidingView>

      );

    }

};


  const styles = StyleSheet.create({
    Welcome:{
      fontSize: 40,
      height:40,
      marginBottom: 20,
      color:'#000000',
      paddingHorizontal:10,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F5F5DC',
    },
    loginText: {
      height:40,
      marginBottom: 20,
      color:'#000000',
      paddingHorizontal:10,
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
    },
    buttonText:{
      textAlign:'center',
      color: '#FFFFFF',
      fontWeight:'700',
    },
    errorText:{
      textAlign:'center',
      color: '#8b0000',
      fontSize:10,
      paddingHorizontal:20,

    }
  });
