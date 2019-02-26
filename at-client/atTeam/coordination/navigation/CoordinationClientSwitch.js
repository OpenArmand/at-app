import React from 'react';
import { Platform } from 'react-native';
import { createSwitchNavigator, createAppContainer, createStackNavigator, createDrawerNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';

import MainAccountScreen from '../screens/AccountFolder/MainAccountScreen';
import MainAnalyticScreen from '../screens/AnalyticFolder/MainAnalyticScreen';
import MainSurveillanceScreen from '../screens/SurveillanceFolder/MainSurveillanceScreen';

import ContentTabNavigator from './ContentTabNavigator';
import PhotographyTabNavigator from './PhotographyTabNavigator';
import AdTabNavigator from './AdTabNavigator';

import InfluencerTabNavigator from './InfluencerTabNavigator';

import MainStrategyScreen from '../screens/StrategyFolder/MainStrategyScreen';

import MainTabNavigator from '../../../HomeFolder/MainTabNavigator';

import ClientScreen from '../screens/ClientPick/ClientScreen';
import ClientSettingsScreen from '../screens/ClientPick/config/ClientSettingsScreen';
import SelectServiceScreen from '../screens/ClientPick/config/SelectServiceScreen';
import ConfigServiceScreen from '../screens/ClientPick/config/ConfigServiceScreen';
import CoreAssignScreen from '../screens/ClientPick/config/CoreAssignScreen';
import ContentCreatorAssignScreen from '../screens/ClientPick/config/ContentCreatorAssignScreen';


const DrawerNavigator = createDrawerNavigator({
  Home: {
    screen: MainTabNavigator,
  },
  Account:{
    screen:MainAccountScreen,
  },
  Strategy:{
    screen:MainStrategyScreen,
  },
  Content:{
    screen:ContentTabNavigator,
  },
  Photography:{
    screen:PhotographyTabNavigator,
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
  'ServiceSelectConfig': SelectServiceScreen,
  'ServiceConfig': ConfigServiceScreen,
  'CoreAssign':CoreAssignScreen,
  'ContentCreatorAssign':ContentCreatorAssignScreen,
  'ClientSettings':ClientSettingsScreen,

});





const CoordinationClientSwitch= createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Client:ClientStack,
  Drawer: DrawerNavigator,
});

export default CoordinationClientSwitch;
