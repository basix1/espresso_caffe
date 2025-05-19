import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './index';
import Login from './login';
import Signup from './signup';

const AuthStack = createStackNavigator();
// app/auth/_layout.tsx
export default function AuthLayout() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={Welcome} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Signup" component={Signup} />
    </AuthStack.Navigator>
  );
}
