import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator,createMaterialTopTabNavigator,createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import PhotographySchedulingScreen from '../screens/PhotographyFolder/PhotographySchedulingScreen';
import ShootPlanScreen from '../screens/PhotographyFolder/ShootPlanScreen';
import MediaScreen from '../screens/PhotographyFolder/MediaScreen';




const PhotographyTabNavigator = createBottomTabNavigator(

{
    Scheduling: {
        screen: PhotographySchedulingScreen,
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

    SchootPlan: {
        screen: ShootPlanScreen,
        navigationOptions: {
            tabBarLabel: 'Plan',

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
