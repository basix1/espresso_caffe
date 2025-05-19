import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { BluetoothDevice } from '../types';
import { theme } from '../constants/theme';
import i18n from '../i18n';
import { Bluetooth, Link,  } from 'lucide-react-native';

interface BluetoothDevicesListProps {
  devices: BluetoothDevice[];
  isScanning: boolean;
  onConnect: (deviceId: string) => void;
  onDisconnect: (deviceId: string) => void;
}

const BluetoothDevicesList: React.FC<BluetoothDevicesListProps> = ({
  devices,
  isScanning,
  onConnect,
  onDisconnect
}) => {
  // Function to render signal strength indicator
  const renderSignalStrength = (rssi?: number) => {
    if (!rssi) return null;
    
    // RSSI ranges from about -30 (very strong) to -100 (very weak)
    let bars = 0;
    if (rssi > -60) bars = 3; // Strong
    else if (rssi > -80) bars = 2; // Medium
    else bars = 1; // Weak
    
    return (
      <View style={styles.signalContainer}>
        {[1, 2, 3].map(i => (
          <View 
            key={i}
            style={[
              styles.signalBar, 
              i <= bars ? styles.signalActive : styles.signalInactive,
              { height: i * 5 + 5 } // Increasing height for each bar
            ]} 
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Bluetooth size={24} color={theme.colors.primary[600]} />
        <Text style={styles.headerText}>{i18n.t('home.bluetoothDevices')}</Text>
      </View>
      
      {isScanning ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{i18n.t('common.loading')}</Text>
        </View>
      ) : devices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{i18n.t('home.noBluetoothDevices')}</Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.deviceContainer}>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
                {renderSignalStrength(item.rssi)}
              </View>
              
              <TouchableOpacity
                style={[
                  styles.connectButton,
                  item.isConnected ? styles.disconnectButton : styles.connectButtonNormal
                ]}
                onPress={() => {
                  if (item.isConnected) {
                    onDisconnect(item.id);
                  } else {
                    onConnect(item.id);
                  }
                }}
              >
                {item.isConnected ? (
                  <Link size={18} color={theme.colors.neutral[100]} />
                ) : (
                  <Link size={18} color={theme.colors.neutral[100]} />
                )}
              </TouchableOpacity>
            </View>
          )}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    ...theme.shadow.medium,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  headerText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.neutral[900],
    marginLeft: theme.spacing.sm,
  },
  loadingContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.neutral[600],
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.neutral[600],
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  deviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  deviceInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deviceName: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.neutral[800],
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 15,
    width: 20,
    gap: 2,
  },
  signalBar: {
    width: 4,
    borderRadius: 1,
  },
  signalActive: {
    backgroundColor: theme.colors.primary[500],
  },
  signalInactive: {
    backgroundColor: theme.colors.neutral[300],
  },
  connectButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.radii.md,
    marginLeft: theme.spacing.sm,
  },
  connectButtonNormal: {
    backgroundColor: theme.colors.primary[600],
  },
  disconnectButton: {
    backgroundColor: theme.colors.error[600],
  },
});

export default BluetoothDevicesList;