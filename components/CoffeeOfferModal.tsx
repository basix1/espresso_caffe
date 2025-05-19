import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { CoffeeOffer, User } from '../types';
import { theme } from '../constants/theme';
import i18n from '../i18n';
import { Coffee, X } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface CoffeeOfferModalProps {
  visible: boolean;
  offer?: CoffeeOffer;
  sender?: User;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}

const CoffeeOfferModal: React.FC<CoffeeOfferModalProps> = ({
  visible,
  offer,
  sender,
  onAccept,
  onDecline,
  onClose
}) => {
  // Animation for the cup
  const cupRotation = useSharedValue(0);
  
  React.useEffect(() => {
    if (visible) {
      // Start the coffee cup animation
      cupRotation.value = withSpring(-0.1, { damping: 3, stiffness: 100 });
      setTimeout(() => {
        cupRotation.value = withSpring(0.1, { damping: 3, stiffness: 100 });
      }, 500);
      setTimeout(() => {
        cupRotation.value = withSpring(0, { damping: 4, stiffness: 100 });
      }, 1000);
    } else {
      cupRotation.value = 0;
    }
  }, [visible, cupRotation]);
  
  const animatedCupStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${cupRotation.value}rad` }
      ]
    };
  });

  if (!offer || !sender) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={theme.colors.neutral[500]} />
          </TouchableOpacity>
          
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: sender.avatar }} 
              style={styles.avatar} 
            />
          </View>
          
          <Text style={styles.title}>
            {i18n.t('home.coffeeOfferReceived', { name: sender.name })}
          </Text>
          
          <Animated.View style={[styles.coffeeIconContainer, animatedCupStyle]}>
            <Coffee size={60} color={theme.colors.primary[700]} />
          </Animated.View>
          
          <Text style={styles.offerTypeText}>
            {offer.type === 'buying' 
              ? "They'd like to buy you a coffee!" 
              : "They're asking if you'll buy them a coffee!"}
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.declineButton]}
              onPress={onDecline}
            >
              <Text style={styles.declineButtonText}>{i18n.t('home.decline')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.acceptButton]}
              onPress={onAccept}
            >
              <Text style={styles.acceptButtonText}>{i18n.t('home.accept')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radii.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadow.large,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
  avatarContainer: {
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.primary[500],
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.neutral[900],
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  coffeeIconContainer: {
    marginVertical: theme.spacing.lg,
  },
  offerTypeText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.neutral[700],
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: theme.colors.primary[600],
  },
  declineButton: {
    backgroundColor: theme.colors.neutral[300],
  },
  acceptButtonText: {
    color: theme.colors.neutral[100],
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
  },
  declineButtonText: {
    color: theme.colors.neutral[700],
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
});

export default CoffeeOfferModal;