import React from 'react';
import { Platform } from 'react-native';
import { createSwitchNavigator, createAppContainer, createStackNavigator, createDrawerNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';

import MainAccountScreen from '../screens/AccountFolder/MainAccountScreen';
import ProfileScreen from '../screens/AccountFolder/ProfileScreen';

import MainAnalyticScreen from '../screens/AnalyticFolder/MainAnalyticScreen';
import MainSurveillanceScreen from '../screens/SurveillanceFolder/MainSurveillanceScreen';

import ContentTabNavigator from './ContentTabNavigator';
import PhotographyStack from './PhotographyStack';
import AdTabNavigator from './AdTabNavigator';

import InfluencerTabNavigator from './InfluencerTabNavigator';

import MainStrategyScreen from '../screens/StrategyFolder/MainStrategyScreen';

import MainTabNavigator from './MainTabNavigator';

import ClientScreen from '../screens/ClientPick/ClientScreen';
import ClientSettingsScreen from '../screens/ClientPick/config/ClientSettingsScreen';
import SelectServiceScreen from '../screens/ClientPick/config/SelectServiceScreen';
import ConfigServiceScreen from '../screens/ClientPick/config/ConfigServiceScreen';

import PhotographerAssignScreen from '../screens/ClientPick/config/PhotographerAssignScreen';


const AccountStack = createStackNavigator({
  'MainAccountScreen': MainAccountScreen,
  'Profile': ProfileScreen,

});

const DrawerNavigator = createDrawerNavigator({
  Home: {
    screen: MainTabNavigator,
  },
  Account:{
    screen:AccountStack,
  },
  Strategy:{
    screen:MainStrategyScreen,
  },
  Content:{
    screen:ContentTabNavigator,
  },
  Photography:{
    screen:PhotographyStack,
  },
  Influencers:{
    screen:InfluencerTabNavigator,
  },
  Ads:{
    screen:AdTabNavigator,
  },
  Surveillance:{
    screen:MainSurveillanceScreen,
  },
  Analytics:{
    screen:MainAnalyticScreen,
  },

});


const ClientStack = createStackNavigator({
  'ClientMain': ClientScreen,
  'ClientSettings':ClientSettingsScreen,
  'PhotographerAssign':PhotographerAssignScreen,

});





const PhotographerClientSwitch= createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Drawer: DrawerNavigator,
});

export default PhotographerClientSwitch;
