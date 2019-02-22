import React from 'react';
import './shim'
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import {createDrawerNavigator, createSwitchNavigator,createStackNavigator,createAppContainer} from 'react-navigation';
import ClientSwitch from './client/navigation/ClientSwitch';
import ContentCreatorClientSwitch from './atTeam/contentCreator/navigation/ContentCreatorClientSwitch';
import CoreClientSwitch from './atTeam/core/navigation/CoreClientSwitch';
import CoordinationClientSwitch from './atTeam/coordination/navigation/CoordinationClientSwitch';
import DesignerDrawerNavigator from './atTeam/designer/navigation/DesignerDrawerNavigator';
import GodClientSwitch from './atTeam/god/navigation/GodClientSwitch';
import PhotographerDrawerNavigator from './atTeam/photographer/navigation/PhotographerDrawerNavigator';
import AdDrawerNavigator from './atTeam/ad/navigation/AdDrawerNavigator';

import AuthLoadingScreen from './authScreens/AuthLoadingScreen';
import LoginScreen from './authScreens/LoginScreen';
import RecoverScreen from './authScreens/RecoverScreen';

import SignupScreen from './authScreens/SignupScreen';
import PickServicesScreen from './Package/PickServicesScreen';
import CustomizePackageScreen from './Package/CustomizePackageScreen';
import RatingScreen from './ratings/RatingScreen';


window.navigator.userAgent = "react-native";
import io from 'socket.io-client/dist/socket.io';



// @flow

// Initialize Firebase

const PackageStack = createStackNavigator({

  PickServices: {
    screen: PickServicesScreen,
    navigationOptions: {
      title: "Pick Services"
    }
  },
  CustomizePackage: {
    screen: CustomizePackageScreen,
    navigationOptions: {
      title: "Customize Package"
    }
  }

 });


const AuthStack = createStackNavigator({


  LogIn: {
    screen: LoginScreen,
    navigationOptions: {
      title: "Log In"
    }
  },
  SignUp: {
   screen: SignupScreen,
   navigationOptions: {
     title: "Sign Up"
   }
 },
 Recover:{
   screen: RecoverScreen,
   navigationOptions: {
     title: "Recover Account"
   }
 }
 });


const AuthContainer= createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    ClientApp: ClientSwitch,
    ContentCreatorApp: ContentCreatorClientSwitch,
    Auth: AuthStack,
    Package:PackageStack,
    Rating:RatingScreen,
    CoreApp:CoreClientSwitch,
    CoordinationApp:CoordinationClientSwitch,
    DesignerApp:DesignerDrawerNavigator,
    GodApp:GodClientSwitch,
    PhotographerApp:PhotographerDrawerNavigator,
    AdApp:AdDrawerNavigator,


  },
  {
    initialRouteName: 'AuthLoading',
  }
));



export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
       <View style={styles.container}>
          <AuthContainer/>
        </View>

      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
