import { useState, useEffect } from 'react';
import { User, AuthState } from '../types';

// Mock data for demonstration purposes
const MOCK_USER: User = {
  id: '1',
  name: 'Demo User',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  isNearby: true,
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  // Initialize auth state
  useEffect(() => {
    // Simulate checking if user is already logged in
    const checkAuth = async () => {
      try {
        // In a real app, we would check if the user is logged in via AsyncStorage or a token
        // Simulate a loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, we'll assume the user is not logged in initially
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      // Simulate API call for authentication
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll log in with any credentials
      setAuthState({
        isAuthenticated: true,
        user: MOCK_USER,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error signing in:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Invalid credentials' };
    }
  };

  // Sign up function
  const signUp = async (name: string, email: string, password: string) => {
    try {
      // Simulate API call for registration
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll create an account with any credentials
      const newUser: User = {
        ...MOCK_USER,
        name,
      };
      
      setAuthState({
        isAuthenticated: true,
        user: newUser,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error signing up:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Registration failed' };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // Simulate API call for sign out
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Sign out failed' };
    }
  };

  // Update user function
  const updateUser = async (updates: Partial<User>) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (authState.user) {
        const updatedUser = { ...authState.user, ...updates };
        
        setAuthState({
          isAuthenticated: true,
          user: updatedUser,
          isLoading: false,
        });
        
        return { success: true };
      }
      
      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Error updating user:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Update failed' };
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    updateUser,
  };
}