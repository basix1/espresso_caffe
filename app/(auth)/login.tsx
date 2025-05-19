import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../constants/theme';
import i18n from '../../i18n';
import { useAuth } from '../../hooks/useAuth';
import HeartLogo from '../../components/HeartLogo';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

const Login = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError(i18n.t('common.somethingWentWrong'));
      return;
    }

    try {
      const { success, error } = await signIn(email, password);
      if (success) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Tabs' }],
        });
      } else {
        setError(error || i18n.t('common.somethingWentWrong'));
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError(i18n.t('common.somethingWentWrong'));
    }
  };

  const goToSignUp = () => navigation.navigate('Signup');
  const goBack = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <ArrowLeft size={24} color={theme.colors.neutral[800]} />
      </TouchableOpacity>

      <Animated.View entering={FadeIn.duration(800)} style={styles.contentContainer}>
        <HeartLogo size={80} animated={false} withText={false} />
        <Text style={styles.title}>{i18n.t('auth.welcomeBack')}</Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.formContainer}>
          <Text style={styles.label}>{i18n.t('auth.email')}</Text>
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            placeholderTextColor={theme.colors.neutral[500]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>{i18n.t('auth.password')}</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={theme.colors.neutral[500]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>{i18n.t('auth.forgotPassword')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signInButton} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={theme.colors.neutral[100]} />
          ) : (
            <Text style={styles.signInButtonText}>{i18n.t('auth.signIn')}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>{i18n.t('auth.dontHaveAccount')}</Text>
          <TouchableOpacity onPress={goToSignUp}>
            <Text style={styles.signUpLink}>{i18n.t('auth.signUp')}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[100],
  },
  backButton: {
    position: 'absolute',
    top: theme.spacing.xl,
    left: theme.spacing.md,
    zIndex: 1,
    padding: theme.spacing.sm,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.typography.fontFamily.display,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.primary[700],
    marginVertical: theme.spacing.lg,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: theme.colors.error[100],
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  errorText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error[700],
  },
  formContainer: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[700],
    marginBottom: theme.spacing.xs,
  },
  input: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary[600],
  },
  signInButton: {
    backgroundColor: theme.colors.primary[600],
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadow.medium,
  },
  signInButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[100],
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.lg,
  },
  signUpText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[700],
    marginRight: theme.spacing.xs,
  },
  signUpLink: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary[600],
  },
});
