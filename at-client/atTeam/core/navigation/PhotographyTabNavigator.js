import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator,createMaterialTopTabNavigator,createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import PhotographySchedulingScreen from '../screens/PhotographyFolder/PhotographySchedulingScreen';
import ShootDeckScreen from '../screens/PhotographyFolder/ShootDeckScreen';

import MediaScreen from '../screens/PhotographyFolder/MediaScreen';
import ShootPickerScreen from '../screens/PhotographyFolder/ShootPickerScreen';


const ShootDetailsStack = createStackNavigator({
  'SchedulingShoot': PhotographySchedulingScreen,
  'ShootDeck': ShootDeckScreen,

});

const PhotographyTabNavigator = createBottomTabNavigator(

{
  PhotoShoot:{
      screen: ShootPickerScreen,
      navigationOptions: {
          tabBarLabel: 'Pick Shoot',

          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              name={Platform.OS === 'ios' ? 'md-clipboard' : 'md-link'}
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

    Media: {
        screen: MediaScreen,
        navigationOptions: {
            tabBarLabel: 'Media',

            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                name={Platform.OS === 'ios' ? 'md-images' : 'md-link'}
              />
            ),

            tabBarOptions: {
                activeTintColor: '#2896d3',
                labelStyle: {
                    fontSize: 14,
                },
            },
        },
    }
}
);




export default PhotographyTabNavigator;
