import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator,createMaterialTopTabNavigator,createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import AdPickerScreen from '../screens/AdFolder/AdPickerScreen';
import AdPlanScreen from '../screens/AdFolder/AdPlanScreen';

const AdDetailsStack = createStackNavigator({
  'AdPlan': AdPlanScreen,
});

const AdStack = createStackNavigator({
  'AdPicker': AdPickerScreen,
  'AdDetails':AdDetailsStack,
});


export default AdStack;
