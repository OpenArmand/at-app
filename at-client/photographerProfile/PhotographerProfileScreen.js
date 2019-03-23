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
import io from 'socket.io-client/dist/socket.io';


export default class PhotographerProfileScreen extends React.Component {


  constructor() {
  super();

  this.state = {
  primaryLocation: '',
};

  this.socket=io.connect('http://localhost:3000/profile', {reconnect: true});

};

async componentDidMount(){

  const photographerProfile = await this.props.navigation.getParam('photographerProfile', 'some default value');

  this.setState({
    primaryLocation:photographerProfile.primaryLocation,
  });
}

    render() {
      return (

        <View style={styles.container}>

        <View>
        <Text> Primary Location: {this.state.primaryLocation}</Text>
        </View>

        </View>


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
