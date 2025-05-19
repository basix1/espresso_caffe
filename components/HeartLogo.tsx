import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import i18n from '../i18n';

interface HeartLogoProps {
  size?: number;
  color?: string;
  animated?: boolean;
  withText?: boolean;
}

const HeartLogo: React.FC<HeartLogoProps> = ({ 
  size = 120, 
  color = theme.colors.secondary[500],
  animated = true,
  withText = true
}) => {
  // Animation values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  
  // Start animations when component mounts
  React.useEffect(() => {
    if (animated) {
      // Pulsating effect
      scale.value = withRepeat(
        withSpring(1.1, { damping: 4, stiffness: 80 }),
        -1, // infinite repeat
        true // reverse
      );
      
      // Subtle rotation
      rotation.value = withRepeat(
        withTiming(0.05, { 
          duration: 2000,
          easing: Easing.inOut(Easing.ease)
        }),
        -1, // infinite repeat
        true // reverse
      );
    }
  }, [animated, scale, rotation]);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}rad` }
      ]
    };
  });
  
  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle]}>
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </Svg>
      </Animated.View>
      
      {withText && (
        <View style={styles.textContainer}>
          <Text style={styles.appName}>{i18n.t('common.appName')}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginTop: theme.spacing.md,
  },
  appName: {
    fontFamily: theme.typography.fontFamily.display,
    fontSize: theme.typography.fontSize.xxxl,
    color: theme.colors.primary[700],
    textAlign: 'center',
  },
});

export default HeartLogo;