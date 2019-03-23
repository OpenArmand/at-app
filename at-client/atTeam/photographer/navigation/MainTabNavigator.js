import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';


import MainHomeScreen from '../screens/HomeFolder/MainHomeScreen';
import ActivityScreen from '../screens/HomeFolder/ActivityScreen';
import ChatScreen from '../screens/HomeFolder/ChatScreen';
import CalendarScreen from '../screens/HomeFolder/CalendarScreen';
import TabBarIcon from '../components/TabBarIcon';


const HomeStack = createStackNavigator({
  Home: MainHomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const ActivityStack = createStackNavigator({
  Activity: ActivityScreen,
});

ActivityStack.navigationOptions = {
  tabBarLabel: 'Activity',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-notifications' : 'md-link'}
    />
  ),
};

const ChatStack = createStackNavigator({
  Settings: ChatScreen,
});

ChatStack.navigationOptions = {
  tabBarLabel: 'Chat',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-chatboxes' : 'md-options'}
    />
  ),
};


const CalendarStack = createStackNavigator({
  Settings: CalendarScreen,
});

CalendarStack.navigationOptions = {
  tabBarLabel: 'Calendar',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-calendar' : 'md-options'}
    />
  ),
};





export default createBottomTabNavigator({
  HomeStack,
  ActivityStack,
  CalendarStack,
  ChatStack,

});
