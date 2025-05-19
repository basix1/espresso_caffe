import { useState } from 'react';
import { CoffeeOffer, User } from '../types';

interface CoffeeOfferState {
  sentOffers: CoffeeOffer[];
  receivedOffers: CoffeeOffer[];
  isLoading: boolean;
}

export function useCoffeeOffer(currentUserId: string) {
  const [offerState, setOfferState] = useState<CoffeeOfferState>({
    sentOffers: [],
    receivedOffers: [],
    isLoading: false,
  });

  // Send a coffee offer
  const sendCoffeeOffer = async (
    receiverId: string, 
    type: 'buying' | 'receiving'
  ) => {
    try {
      setOfferState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new offer
      const newOffer: CoffeeOffer = {
        id: `offer_${Date.now()}`,
        senderId: currentUserId,
        receiverId,
        type,
        status: 'pending',
        timestamp: Date.now(),
      };
      
      // Update state with new offer
      setOfferState(prev => ({
        ...prev,
        sentOffers: [...prev.sentOffers, newOffer],
        isLoading: false,
      }));
      
      return { success: true, offerId: newOffer.id };
    } catch (error) {
      console.error('Error sending coffee offer:', error);
      setOfferState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Failed to send coffee offer' };
    }
  };

  // Respond to a coffee offer
  const respondToCoffeeOffer = async (
    offerId: string,
    accept: boolean
  ) => {
    try {
      setOfferState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update offer status
      setOfferState(prev => ({
        ...prev,
        receivedOffers: prev.receivedOffers.map(offer => {
          if (offer.id === offerId) {
            return {
              ...offer,
              status: accept ? 'accepted' : 'rejected',
            };
          }
          return offer;
        }),
        isLoading: false,
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error responding to coffee offer:', error);
      setOfferState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Failed to respond to coffee offer' };
    }
  };

  // Get offer by ID
  const getOfferById = (offerId: string) => {
    return (
      offerState.sentOffers.find(offer => offer.id === offerId) ||
      offerState.receivedOffers.find(offer => offer.id === offerId)
    );
  };

  // Get pending offers for a user
  const getPendingOffersForUser = (userId: string) => {
    return offerState.receivedOffers.filter(
      offer => offer.senderId === userId && offer.status === 'pending'
    );
  };

  // Simulate receiving a coffee offer (for demo purposes)
  const simulateReceiveCoffeeOffer = async (
    sender: User,
    type: 'buying' | 'receiving'
  ) => {
    try {
      // Create new offer
      const newOffer: CoffeeOffer = {
        id: `offer_${Date.now()}`,
        senderId: sender.id,
        receiverId: currentUserId,
        type,
        status: 'pending',
        timestamp: Date.now(),
      };
      
      // Update state with new offer
      setOfferState(prev => ({
        ...prev,
        receivedOffers: [...prev.receivedOffers, newOffer],
      }));
      
      return { success: true, offerId: newOffer.id };
    } catch (error) {
      console.error('Error simulating coffee offer:', error);
      return { success: false, error: 'Failed to simulate coffee offer' };
    }
  };

  return {
    ...offerState,
    sendCoffeeOffer,
    respondToCoffeeOffer,
    getOfferById,
    getPendingOffersForUser,
    simulateReceiveCoffeeOffer,
  };
}