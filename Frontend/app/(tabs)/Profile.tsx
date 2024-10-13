import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../../Screens/ProfileScreen';

const Stack = createStackNavigator();

export default function Profile() {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
