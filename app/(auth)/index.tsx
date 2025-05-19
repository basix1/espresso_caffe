import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import theme from '../../constants/theme';
import i18n from '../../i18n';
import { DEFAULT_LANGUAGE } from '../../constants/languages';
import LanguageSelector from '../../components/LanguageSelector';
import HeartLogo from '../../components/HeartLogo';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function Welcome() {
  const navigation = useNavigation<NavigationProp>();
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [, forceUpdate] = useState(0);

  const handleLanguageChange = (languageCode: string) => {
    i18n.locale = languageCode;
    setLanguage(languageCode); // AGGIORNA LO STATO
    forceUpdate(n => n + 1); // forza re-render

  };


  const handleSignIn = () => navigation.navigate('Login');
  const handleSignUp = () => navigation.navigate('Signup');

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.delay(300).duration(1000)} style={styles.logoContainer}>
        <HeartLogo size={100} animated={true} />
      </Animated.View>

      <Image
        source={require('../../assets/images/background.jpeg')}
        style={styles.backgroundImage}
        blurRadius={Platform.OS === 'ios' ? 30 : 10}
      />

      <Animated.View entering={FadeInDown.delay(800).duration(800)} style={styles.contentContainer}>
        <Text style={styles.welcomeText}>{i18n.t('onboarding.welcomeToEspresso')}</Text>
        <Text style={styles.descriptionText}>{i18n.t('onboarding.connectWithPeople')}</Text>

        <View style={styles.languageContainer}>
          <Text style={styles.selectLanguageText}>{i18n.t('onboarding.selectLanguage')}</Text>
          <LanguageSelector
            onSelectLanguage={handleLanguageChange}
            selectedLanguageCode={language}
          />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(1100).duration(800)} style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>{i18n.t('auth.signUp')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.signInButton]} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>{i18n.t('auth.signIn')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.xl,
  },
  backgroundImage: {
    position: 'absolute',
    width: '110%',
    height: '60%',
    marginTop: 60,
    opacity: 0.4,
    borderRadius: 40,
  },
  logoContainer: {
    position: 'absolute',
    top: -20,
    marginTop: theme.spacing.xxl * 2,
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 120,
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  welcomeText: {
    fontFamily: theme.typography.fontFamily.display,
    fontSize: theme.typography.fontSize.xxxl,
    color: theme.colors.primary[900],
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  descriptionText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutral[800],
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: theme.typography.fontSize.lg * theme.typography.lineHeight.body,
  },
  languageContainer: {
    width: '100%',
    marginTop: theme.spacing.xl,
  },
  selectLanguageText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[800],
    marginBottom: theme.spacing.sm,
  },
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: -30,
    marginBottom: theme.spacing.xl,
  },
  button: {
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadow.medium,
  },
  signUpButton: {
    backgroundColor: theme.colors.primary[600],
  },
  signInButton: {
    backgroundColor: theme.colors.secondary[500],
  },
  signUpButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[100],
  },
  signInButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[100],
  },
});
