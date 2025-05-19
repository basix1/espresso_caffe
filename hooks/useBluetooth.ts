import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { BluetoothState, BluetoothDevice, User } from '../types';

// Mock data for demonstration purposes
const MOCK_NEARBY_USERS: User[] = [
  {
    id: '1',
    name: 'Sofia Chen',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNearby: true,
    distance: 15,
    deviceId: 'device1',
  },
  {
    id: '2',
    name: 'Marco Rossi',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNearby: true,
    distance: 23,
    deviceId: 'device2',
  },
  {
    id: '3',
    name: 'Camila Lopez',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNearby: true,
    distance: 37,
    deviceId: 'device3',
  },
  {
    id: '4',
    name: 'David Kim',
    avatar: 'https://images.pexels.com/photos/936119/pexels-photo-936119.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNearby: true,
    distance: 42,
    deviceId: 'device4',
  },
  {
    id: '5',
    name: 'basile edoardo',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNearby: true,
    distance: 50,
    deviceId: 'device5',
  },
    {
    id: '6',
    name: 'Loris Basile',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNearby: true,
    distance: 50,
    deviceId: 'device5',
  },
];

const MOCK_BLUETOOTH_DEVICES: BluetoothDevice[] = [
  {
    id: 'device1',
    name: 'iPhone 14 Pro',
    isConnected: false,
    rssi: -75,
  },
  {
    id: 'device2',
    name: 'Samsung Galaxy S22',
    isConnected: false,
    rssi: -82,
  },
  {
    id: 'device3',
    name: 'Macbook Pro',
    isConnected: false,
    rssi: -66,
  },
  {
    id: 'device4',
    name: 'Bluetooth Speaker',
    isConnected: false,
    rssi: -88,
  },
  {
    id: 'device5',
    name: 'AirPods Pro',
    isConnected: false,
    rssi: -72,
  },
];

export function useBluetooth() {
  const [bluetoothState, setBluetoothState] = useState<BluetoothState>({
    isEnabled: false,
    isScanning: false,
    devices: [],
    nearbyUsers: [],
    detectionRange: 50, // Default detection range in meters
  });

  // Initialize Bluetooth state
  useEffect(() => {
    const initBluetooth = async () => {
      if (Platform.OS === 'web') {
        // Web doesn't have Bluetooth API access in the same way
        console.log('Bluetooth API not fully supported on Web');
        setBluetoothState(prev => ({
          ...prev,
          isEnabled: true, // Pretend it's enabled for demo
        }));
        return;
      }

      try {
        // In a real app, we would check if Bluetooth is enabled
        // For demo purposes, we'll assume it's enabled
        setBluetoothState(prev => ({
          ...prev,
          isEnabled: true,
        }));
      } catch (error) {
        console.error('Error initializing Bluetooth:', error);
      }
    };

    initBluetooth();
  }, []);

  // Enable Bluetooth
  const enableBluetooth = async () => {
    if (Platform.OS === 'web') {
      console.log('Bluetooth API not fully supported on Web');
      setBluetoothState(prev => ({
        ...prev,
        isEnabled: true, // Pretend it's enabled for demo
      }));
      return { success: true };
    }

    try {
      // In a real app, we would request the user to enable Bluetooth
      // For demo purposes, we'll simulate enabling Bluetooth
      setBluetoothState(prev => ({
        ...prev,
        isEnabled: true,
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error enabling Bluetooth:', error);
      return { success: false, error: 'Failed to enable Bluetooth' };
    }
  };

  // Start scanning for Bluetooth devices
  const startScan = async () => {
    try {
      setBluetoothState(prev => ({
        ...prev,
        isScanning: true,
        devices: [], // Clear previous devices
      }));
      
      // Simulate a delay for scanning
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll use mock data
      setBluetoothState(prev => ({
        ...prev,
        isScanning: false,
        devices: MOCK_BLUETOOTH_DEVICES,
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error scanning for Bluetooth devices:', error);
      setBluetoothState(prev => ({
        ...prev,
        isScanning: false,
      }));
      return { success: false, error: 'Failed to scan for devices' };
    }
  };

  // Start scanning for nearby users
  const scanForNearbyUsers = async () => {
    try {
      if (!bluetoothState.isEnabled) {
        return { success: false, error: 'Bluetooth is not enabled' };
      }
      
      setBluetoothState(prev => ({
        ...prev,
        isScanning: true,
        nearbyUsers: [], // Clear previous users
      }));
      
      // Simulate a delay for scanning
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // For demo purposes, we'll use mock data and filter by detection range
      const usersInRange = MOCK_NEARBY_USERS.filter(
        user => (user.distance || 0) <= bluetoothState.detectionRange
      );
      
      setBluetoothState(prev => ({
        ...prev,
        isScanning: false,
        nearbyUsers: usersInRange,
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error scanning for nearby users:', error);
      setBluetoothState(prev => ({
        ...prev,
        isScanning: false,
      }));
      return { success: false, error: 'Failed to scan for nearby users' };
    }
  };

  // Connect to a device
  const connectToDevice = async (deviceId: string) => {
    try {
      // Simulate connecting to a device
      setBluetoothState(prev => ({
        ...prev,
        devices: prev.devices.map(device => 
          device.id === deviceId 
            ? { ...device, isConnected: true } 
            : device
        ),
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error connecting to device:', error);
      return { success: false, error: 'Failed to connect to device' };
    }
  };

  // Disconnect from a device
  const disconnectFromDevice = async (deviceId: string) => {
    try {
      // Simulate disconnecting from a device
      setBluetoothState(prev => ({
        ...prev,
        devices: prev.devices.map(device => 
          device.id === deviceId 
            ? { ...device, isConnected: false } 
            : device
        ),
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error disconnecting from device:', error);
      return { success: false, error: 'Failed to disconnect from device' };
    }
  };

  // Set detection range
  const setDetectionRange = (range: number) => {
    setBluetoothState(prev => ({
      ...prev,
      detectionRange: range,
    }));
  };

  return {
    ...bluetoothState,
    enableBluetooth,
    startScan,
    scanForNearbyUsers,
    connectToDevice,
    disconnectFromDevice,
    setDetectionRange,
  };
}