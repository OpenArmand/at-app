import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator,createMaterialTopTabNavigator,createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import InfluencerMainScreen from '../screens/InfluencerFolder/InfluencerMainScreen';
import InfluencerPlanScreen from '../screens/InfluencerFolder/InfluencerPlanScreen';
import InfluencerPostsScreen from '../screens/InfluencerFolder/InfluencerPostsScreen';
import InfluencerBankScreen from '../screens/InfluencerFolder/InfluencerBankScreen';
import CreateInfluencerScreen from '../screens/InfluencerFolder/CreateInfluencerScreen';
import CreateEventScreen from '../screens/InfluencerFolder/CreateEventScreen';
import InfluencerEventScreen from '../screens/InfluencerFolder/InfluencerEventScreen';


import InfluencerPickerScreen from '../../../influencerCommon/InfluencerPickerScreen';
import InfluencerProfileScreen from '../../../influencerCommon/InfluencerProfileScreen';



const InfluencerStack = createStackNavigator({
  'Picker': InfluencerPickerScreen,
  'Main': InfluencerMainScreen,
  'InfluencerProfile':InfluencerProfileScreen,
  'Plan': InfluencerPlanScreen,
  'Posts':InfluencerPostsScreen,
  'Bank':InfluencerBankScreen,
  'CreateInfluencer':CreateInfluencerScreen,
  'CreateEvent':CreateEventScreen,
  'Event':InfluencerEventScreen,



});


export default InfluencerStack;
