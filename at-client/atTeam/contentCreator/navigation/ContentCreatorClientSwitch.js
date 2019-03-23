
import React from 'react';
import { Platform } from 'react-native';
import { createSwitchNavigator, createAppContainer, createStackNavigator, createDrawerNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';

import MainAccountScreen from '../screens/AccountFolder/MainAccountScreen';
import MainAnalyticScreen from '../screens/AnalyticFolder/MainAnalyticScreen';
import MainSurveillanceScreen from '../screens/SurveillanceFolder/MainSurveillanceScreen';

import ContentTabNavigator from './ContentTabNavigator';
import PhotographyStack from './PhotographyStack';
import AdStack from './AdStack';

import InfluencerStack from './InfluencerStack';

import MainStrategyScreen from '../screens/StrategyFolder/MainStrategyScreen';

import MainTabNavigator from '../../../HomeFolder/MainTabNavigator';

import ClientScreen from '../screens/ClientPick/ClientScreen';
import ClientSettingsScreen from '../screens/ClientPick/config/ClientSettingsScreen';
import SelectServiceScreen from '../screens/ClientPick/config/SelectServiceScreen';
import ConfigServiceScreen from '../screens/ClientPick/config/ConfigServiceScreen';
import BrainstormScreen from '../screens/Brainstorm/BrainstormScreen';
import CallScreen from '../../../HomeFolder/CallScreen';

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
   screen:PhotographyStack,
  //  screen: PhotographyScreen,
  },
  Influencers:{
    screen:InfluencerStack,
  },
  Ads:{
    screen:AdStack,
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


const contentCreatorClientSwitch= createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Client:ClientStack,
  Drawer: DrawerNavigator,
  Brainstorm:BrainstormScreen,
  MonthlyCall: CallScreen,


});

export default contentCreatorClientSwitch;
