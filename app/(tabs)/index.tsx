import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, globalStyles } from '../../constants/theme';
import i18n from '../../i18n';
import UserProfile from '../../components/UserProfile';
import { useBluetooth } from '../../hooks/useBluetooth';
import { useAuth } from '../../hooks/useAuth';
import { useCoffeeOffer } from '../../hooks/useCoffeeOffer';
import CoffeeOfferModal from '../../components/CoffeeOfferModal';
import BluetoothDevicesList from '../../components/BluetoothDevicesList';
import { User } from '../../types';
import HeartLogo from '../../components/HeartLogo';
import { Bluetooth, Search, RefreshCw } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function HomeScreen() {
  const isFocused = useIsFocused();
  const { isAuthenticated, user } = useAuth();
  const { 
    isEnabled, 
    isScanning, 
    nearbyUsers, 
    devices,
    enableBluetooth, 
    scanForNearbyUsers, 
    startScan,
    connectToDevice,
    disconnectFromDevice
  } = useBluetooth();
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCoffeeOfferModal, setShowCoffeeOfferModal] = useState(false);
  const [offerType, setOfferType] = useState<'buying' | 'receiving'>('buying');
  const [showBluetoothDevices, setShowBluetoothDevices] = useState(false);
  
  const userId = user?.id || '1'; // Default to '1' for demo if no user is logged in
  
  const { sendCoffeeOffer, simulateReceiveCoffeeOffer } = useCoffeeOffer(userId);

  // Scan for nearby users when the screen comes into focus
  useEffect(() => {
    if (isFocused && isEnabled && !isScanning) {
      scanForNearbyUsers();
    }
  }, [isFocused, isEnabled]);

  // Handle Bluetooth enabling
  const handleEnableBluetooth = async () => {
    await enableBluetooth();
  };

  // Handle refresh for scanning nearby users
  const handleRefresh = async () => {
    if (isEnabled) {
      await scanForNearbyUsers();
    }
  };

  // Handle searching for Bluetooth devices
  const handleSearchDevices = async () => {
    if (isEnabled) {
      setShowBluetoothDevices(true);
      await startScan();
    } else {
      await enableBluetooth();
    }
  };

  // Handle buying coffee for a user
  const handleBuyYouCoffee = (user: User) => {
    setSelectedUser(user);
    setOfferType('buying');
    setShowCoffeeOfferModal(true);
  };

  // Handle asking user to buy coffee
  const handleBuyMeCoffee = (user: User) => {
    setSelectedUser(user);
    setOfferType('receiving');
    setShowCoffeeOfferModal(true);
  };

  // Handle accepting a coffee offer
  const handleAcceptOffer = async () => {
    // In a real app, we would accept the offer and open the chat
    setShowCoffeeOfferModal(false);
    // Reset selected user and offer type after a short delay
    setTimeout(() => {
      setSelectedUser(null);
      setOfferType('buying');
    }, 500);
  };

  // Handle declining a coffee offer
  const handleDeclineOffer = () => {
    setShowCoffeeOfferModal(false);
    // Reset selected user and offer type after a short delay
    setTimeout(() => {
      setSelectedUser(null);
      setOfferType('buying');
    }, 500);
  };

  // Render main content based on Bluetooth status
  const renderContent = () => {
    if (!isEnabled) {
      return (
        <View style={styles.emptyStateContainer}>
          <Bluetooth size={60} color={theme.colors.neutral[400]} />
          <Text style={styles.emptyStateText}>{i18n.t('home.enableBluetooth')}</Text>
          <TouchableOpacity 
            style={styles.enableButton}
            onPress={handleEnableBluetooth}
          >
            <Text style={styles.enableButtonText}>{i18n.t('common.continue')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isScanning) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[600]} />
          <Text style={styles.loadingText}>{i18n.t('home.searchingUsers')}</Text>
        </View>
      );
    }

    if (showBluetoothDevices) {
      return (
        <View style={styles.bluetoothListContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>{i18n.t('home.bluetoothDevices')}</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowBluetoothDevices(false)}
            >
              <Text style={styles.closeButtonText}>{i18n.t('common.close')}</Text>
            </TouchableOpacity>
          </View>
          
          <BluetoothDevicesList 
            devices={devices}
            isScanning={isScanning}
            onConnect={connectToDevice}
            onDisconnect={disconnectFromDevice}
          />
        </View>
      );
    }

    if (nearbyUsers.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <HeartLogo size={60} color={theme.colors.neutral[400]} />
          <Text style={styles.emptyStateText}>{i18n.t('home.noNearbyUsers')}</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <RefreshCw size={18} color={theme.colors.neutral[100]} />
            <Text style={styles.refreshButtonText}>{i18n.t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Animated.View entering={FadeIn.duration(500)} style={styles.usersContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>{i18n.t('home.nearbyUsers')}</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <RefreshCw size={16} color={theme.colors.neutral[100]} />
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.userScrollView}>
          {nearbyUsers.map((user, index) => (
            <Animated.View 
              key={user.id} 
              entering={FadeInDown.delay(index * 100).duration(500)}
            >
              <UserProfile 
                user={user}
                onBuyYouCoffee={() => handleBuyYouCoffee(user)}
                onBuyMeCoffee={() => handleBuyMeCoffee(user)}
              />
            </Animated.View>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.container}>
        {renderContent()}
        
        {!showBluetoothDevices && (
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={handleSearchDevices}
          >
            <Search size={24} color={theme.colors.neutral[100]} />
            <Text style={styles.scanButtonText}>{i18n.t('home.searchDevices')}</Text>
          </TouchableOpacity>
        )}
        
        <CoffeeOfferModal 
          visible={showCoffeeOfferModal}
          offer={selectedUser ? {
            id: 'temp_id',
            senderId: selectedUser.id,
            receiverId: userId,
            type: offerType,
            status: 'pending',
            timestamp: Date.now(),
          } : undefined}
          sender={selectedUser!}
          onAccept={handleAcceptOffer}
          onDecline={handleDeclineOffer}
          onClose={() => setShowCoffeeOfferModal(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.neutral[900],
  },
  refreshButton: {
    backgroundColor: theme.colors.primary[600],
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.small,
  },
  usersContainer: {
    flex: 1,
  },
  userScrollView: {
    flexGrow: 0,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyStateText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutral[700],
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  enableButton: {
    backgroundColor: theme.colors.primary[600],
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radii.md,
    ...theme.shadow.medium,
  },
  enableButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[100],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[700],
    marginTop: theme.spacing.md,
  },
  scanButton: {
    backgroundColor: theme.colors.secondary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.md,
    marginTop: theme.spacing.md,
    ...theme.shadow.medium,
  },
  scanButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[100],
    marginLeft: theme.spacing.sm,
  },
  bluetoothListContainer: {
    flex: 1,
  },
  closeButton: {
    backgroundColor: theme.colors.neutral[300],
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.md,
  },
  closeButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[700],
  },
  refreshButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[100],
    marginLeft: theme.spacing.xs,
  },
});