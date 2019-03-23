import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator,createMaterialTopTabNavigator,createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import PhotographySchedulingScreen from '../screens/PhotographyFolder/PhotographySchedulingScreen';
import ShootDeckScreen from '../screens/PhotographyFolder/ShootDeckScreen';

import ShootPickerScreen from '../../../SectionPickers/ShootPickerScreen';
import MainTabNavigator from '../../../HomeFolder/MainTabNavigator';
import PhotographerProfileScreen from '../../../photographerProfile/PhotographerProfileScreen';


const ShootDetailsStack = createStackNavigator({
  'SchedulingShoot': PhotographySchedulingScreen,
  'ShootDeck': ShootDeckScreen,
  'PhotographerProfile':PhotographerProfileScreen,

});

const PhotographyTabNavigator = createBottomTabNavigator(

{

    SchedulingShoot: {
        screen: ShootDetailsStack,
        navigationOptions: {
            tabBarLabel: 'Scheduling',

            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                name={Platform.OS === 'ios' ? 'md-time' : 'md-link'}
              />
            ),

            tabBarOptions: {
                activeTintColor: '#2896d3',
                labelStyle: {
                    fontSize: 14,
                },
            },
        },
    },
}
);

const PhotographyStack = createStackNavigator({
  'PhotoShoot': ShootPickerScreen,
  'PhotographyTabNavigator':PhotographyTabNavigator,

});




export default PhotographyStack;
