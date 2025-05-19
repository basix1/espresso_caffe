import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/theme';
import { Home, MessageCircle, User } from 'lucide-react-native';
import HeartLogo from '../../components/HeartLogo';
import i18n from '../../i18n';

// Screens
import HomeScreen from './index'; // <-- assicurati che i path siano corretti
import ChatScreen from './chat/index'
import ProfileScreen from './profile';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const renderHeaderLogo = () => (
    <TouchableOpacity style={styles.headerLogo}>
      <HeartLogo size={10} animated={false} withText={false} />
    </TouchableOpacity>
  );

  const IconWrapper = (IconComponent: any) => ({ color, size, focused }: any) => (
    <View style={[styles.iconContainer, focused && styles.focusedIcon]}>
      <IconComponent size={size} color={color} />
    </View>
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : theme.colors.primary[500],
        },
        headerTransparent: Platform.OS === 'ios',
        headerTitle: renderHeaderLogo,
        headerTitleAlign: 'left',
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.colors.primary[600],
        tabBarInactiveTintColor: theme.colors.neutral[500],
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: i18n.t('common.appName'),
          tabBarLabel: i18n.t('home.nearbyUsers'),
          tabBarIcon: IconWrapper(Home),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: i18n.t('chat.conversations'),
          tabBarLabel: i18n.t('chat.conversations'),
          tabBarIcon: IconWrapper(MessageCircle),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: i18n.t('profile.myProfile'),
          tabBarLabel: i18n.t('profile.myProfile'),
          tabBarIcon: IconWrapper(User),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.9)' : theme.colors.neutral[100],
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral[300],
    elevation: 8,
    height: 60,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.neutral[900],
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  headerLogo: {
    marginLeft: theme.spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  focusedIcon: {
    backgroundColor: theme.colors.primary[100],
  },
  tabBarLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
  },
});
