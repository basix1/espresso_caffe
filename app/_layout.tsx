// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthLayout from './(auth)/_layout';    // <-- contiene Login & Signup
import TabLayout from './(tabs)/_layout';     // <-- contiene Home, Chat, Profile

export type RootStackParamList = {
  Auth: undefined;
  Tabs: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Auth" component={AuthLayout} />
        <RootStack.Screen name="Tabs" component={TabLayout} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
