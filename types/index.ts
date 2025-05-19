export interface User {
  id: string;
  name: string;
  avatar?: string;
  isNearby: boolean;
  distance?: number; // in meters
  deviceId?: string;
  language?: string;
}

export interface BluetoothDevice {
  id: string;
  name: string;
  isConnected: boolean;
  rssi?: number;
}

export interface CoffeeOffer {
  id: string;
  senderId: string;
  receiverId: string;
  type: 'buying' | 'receiving';
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
};

export type BluetoothState = {
  isEnabled: boolean;
  isScanning: boolean;
  devices: BluetoothDevice[];
  nearbyUsers: User[];
  detectionRange: number;
};