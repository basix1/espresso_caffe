import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from '../types';
import { theme } from '../constants/theme';
import i18n from '../i18n';
import { Coffee, Bluetooth } from 'lucide-react-native';

interface UserProfileProps {
  user: User;
  onBuyYouCoffee: () => void;
  onBuyMeCoffee: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  onBuyYouCoffee, 
  onBuyMeCoffee 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: user.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400' }} 
          style={styles.avatar} 
        />
        {user.distance !== undefined && (
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>{user.distance}m</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.name}>{user.name}</Text>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonPrimary]} 
          onPress={onBuyYouCoffee}
        >
          <Coffee size={18} color={theme.colors.neutral[100]} />
          <Text style={styles.buttonText}>ciao ciap</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.buttonSecondary]} 
          onPress={onBuyMeCoffee}
        >
          <Coffee size={18} color={theme.colors.neutral[100]} />
          <Text style={styles.buttonText}>{i18n.t('home.buyMeCoffee')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radii.lg,
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    ...theme.shadow.medium,
    width: 200,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.sm,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.primary[500],
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary[700],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radii.full,
  },
  distanceText: {
    color: theme.colors.neutral[100],
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  name: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing.sm,
  },
  buttonsContainer: {
    width: '100%',
    gap: theme.spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radii.md,
    gap: theme.spacing.xs,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary[600],
  },
  buttonSecondary: {
    backgroundColor: theme.colors.secondary[500],
  },
  buttonText: {
    color: theme.colors.neutral[100],
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
});

export default UserProfile;