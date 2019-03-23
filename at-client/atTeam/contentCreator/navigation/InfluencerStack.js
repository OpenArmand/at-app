import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator,createMaterialTopTabNavigator,createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import InfluencerMainScreen from '../screens/InfluencerFolder/InfluencerMainScreen';
import InfluencerPlanScreen from '../screens/InfluencerFolder/InfluencerPlanScreen';
import InfluencerPostsScreen from '../screens/InfluencerFolder/InfluencerPostsScreen';
import InfluencerPickerScreen from '../screens/InfluencerFolder/InfluencerPickerScreen';
import InfluencerProfileScreen from '../../../influencerCommon/InfluencerProfileScreen';
import InfluencerEventScreen from '../screens/InfluencerFolder/InfluencerEventScreen';


const InfluencerStack = createStackNavigator({
  'Picker': InfluencerPickerScreen,
  'Main': InfluencerMainScreen,
  'InfluencerProfile':InfluencerProfileScreen,
  'Plan': InfluencerPlanScreen,
  'Posts':InfluencerPostsScreen,
  'Event':InfluencerEventScreen,
});


export default InfluencerStack;
