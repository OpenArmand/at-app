
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


const HomeSwitch= createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
});

const PhotographerDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: HomeSwitch,
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
  Survaillance:{
    screen:MainSurveillanceScreen,
  },
  Analytics:{
    screen:MainAnalyticScreen,
  },

});

export default PhotographerDrawerNavigator;
