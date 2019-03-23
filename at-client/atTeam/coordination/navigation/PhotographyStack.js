import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator,createMaterialTopTabNavigator,createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import PhotographySchedulingScreen from '../screens/PhotographyFolder/PhotographySchedulingScreen';
import PhotographerBankScreen from '../screens/PhotographyFolder/PhotographerBankScreen';
import ShortlistScreen from '../screens/PhotographyFolder/ShortlistScreen';

import ShootDeckScreen from '../screens/PhotographyFolder/ShootDeckScreen';
import ShootPickerScreen from '../../../SectionPickers/ShootPickerScreen';
import PhotographerProfileScreen from '../../../photographerProfile/PhotographerProfileScreen';


const ShootDetailsStack = createStackNavigator({
  'SchedulingShoot': PhotographySchedulingScreen,
  'PhotographerProfile':PhotographerProfileScreen,

  'ShootDeck': ShootDeckScreen,

});


const PhotographerTabNavigator = createMaterialTopTabNavigator({
  PhotographerBank: {
    screen:PhotographerBankScreen,
    navigationOptions: {
            tabBarLabel: 'Bank',


            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                name={Platform.OS === 'ios' ? 'grid' : 'md-link'}
              />
            ),

            tabBarOptions: {
                style:{
                  paddingTop:30,
                },
                labelStyle: {
                    fontSize: 14,
                },
            },

        },
  },
  Shortlist: {
    screen:ShortlistScreen,
    navigationOptions: {
            tabBarLabel: 'Shortlist',


            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                name={Platform.OS === 'ios' ? 'grid' : 'md-link'}
              />
            ),

            tabBarOptions: {
                style:{
                  paddingTop:30,
                },
                labelStyle: {
                    fontSize: 14,
                },
            },

        },
  },
})




const PhotographyTabNavigator = createBottomTabNavigator(

{

  Photographer: {
      screen: PhotographerTabNavigator,
      navigationOptions: {
          tabBarLabel: 'Photographer',

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
    
}
);

const PhotographyStack = createStackNavigator({
  'PhotoShoot': ShootPickerScreen,
  'PhotographyTabNavigator':PhotographyTabNavigator,

});




export default PhotographyStack;
