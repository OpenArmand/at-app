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
  NavigationActions,
  KeyboardAvoidingView,
  Button
} from 'react-native';
import { SecureStore } from 'expo';
import SignupScreen from './SignupScreen';
import io from 'socket.io-client/dist/socket.io';
import { getUrl } from '../utils';

window.navigator.userAgent='react-native';


export default class LoginScreen extends React.Component {


  constructor() {
  super();

  this.state = {
  screenUserName: '',
  screenPassword:'',
  error:'',

};

  this.socket=io.connect(getUrl('/authentication'), {reconnect: true});

};



  _signInAsync = async () => {

    console.log("trying");

 this.socket.emit('signIn', {screenUserName:this.state.screenUserName,
    screenPassword:this.state.screenPassword}); // emit an event to the socket

await this.socket.on('loginStatus', async(data)=>{
  console.log("logo");


  console.log(data);


    if(data.status=="success"){
      await SecureStore.setItemAsync('usernameToken',this.state.screenUserName);
      await SecureStore.setItemAsync('entityToken',data.businessName);

      if (data.businessName=="ContentCreator"){
        this.props.navigation.navigate('ContentCreatorApp');
      }
      else if (data.businessName=="Core"){
        this.props.navigation.navigate('CoreApp');
      }
      else if (data.businessName=="Designer"){
        this.props.navigation.navigate('DesignerApp');
      }
      else if (data.businessName=="Coordination"){
        this.props.navigation.navigate('CoordinationApp');
      }
      else if (data.businessName=="God"){
        this.props.navigation.navigate('GodApp');
      }
      else if (data.businessName=="Photographer"){
        this.props.navigation.navigate('PhotographerApp');
      }
      else if (data.businessName=="Ad"){
        this.props.navigation.navigate('AdApp');
      }
      else{
      await SecureStore.setItemAsync('clientSelectedUsername',this.state.screenUserName);
      await SecureStore.setItemAsync('entityToken','Client');

      this.props.navigation.navigate('ClientApp');


      }
    };
    if(data.status=="incorect password"){
      this.setState({error:"incorrect password"});
    };

    if(data.status=="no such username"){
      this.setState({error:"no such username"});
    };

  });

};

  _goSignUpAsync = async () => {

  this.props.navigation.navigate('SignUp');

  };

  _goRecoverAsync= async () => {

  this.props.navigation.navigate('Recover');

  };




    render() {
      return (

        <KeyboardAvoidingView behavior="padding" style={styles.container}>

        <Text style={styles.Welcome}> Welcome to this @</Text>

        <Text style={styles.loginText}> First just go ahead and login</Text>


            <Text style={styles.errorText}>{this.state.error}</Text>

            <TextInput
            placeholder="username or email"
              returnKeyType="next"
              onSubmitEditing={()=>this.passwordInput.focus()}
              keyboardType="email-address"
              onChangeText={(text) => this.setState({screenUserName:text})}

              style={styles.input}
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
            onPress= {this._signInAsync}>
              <Text style={styles.buttonText}> Login  </Text>
              </TouchableOpacity>


              <TouchableOpacity
              style={styles.buttonContainer}
              onPress= {this._goSignUpAsync}>
                <Text style={styles.buttonText}> First time? just signup  </Text>
                </TouchableOpacity>


                <TouchableOpacity
                style={styles.buttonContainer}
                onPress= {this._goRecoverAsync}>
                  <Text style={styles.buttonText}> Forget Password?  </Text>
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
      paddingHorizontal:20,
    },

    input: {
      height:40,
      backgroundColor:'rgba(255,255,255,0.2)',
      marginBottom: 20,
      color:'#2980b9',
      paddingHorizontal:40,
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
    errorText:{
      textAlign:'center',
      color: '#8b0000',
      fontSize:10,
      paddingHorizontal:20,

    }

    ,
  });
