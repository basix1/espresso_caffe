import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../constants/theme';
import i18n from '../../i18n';
import { useAuth } from '../../hooks/useAuth';
import HeartLogo from '../../components/HeartLogo';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';
import { AuthStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function SignUp() {
  const navigation = useNavigation<NavigationProp>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp, isLoading } = useAuth();

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError(i18n.t('common.somethingWentWrong'));
      return;
    }

    if (password.length < 8) {
      setError(i18n.t('auth.passwordRequirements'));
      return;
    }

    try {
      const { success, error } = await signUp(name, email, password);
      if (success) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Tabs' as keyof AuthStackParamList }],
        });
      } else {
        setError(error || i18n.t('common.somethingWentWrong'));
      }
    } catch (err) {
      console.error('Error during sign up:', err);
      setError(i18n.t('common.somethingWentWrong'));
    }
  };

  const goToLogin = () => navigation.navigate('Login');
  const goBack = () => navigation.goBack();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ArrowLeft size={24} color={theme.colors.neutral[800]} />
        </TouchableOpacity>

        <Animated.View entering={FadeIn.duration(800)} style={styles.contentContainer}>
          <HeartLogo size={80} animated={false} withText={false} />
          <Text style={styles.title}>{i18n.t('auth.createAccount')}</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.formContainer}>
            <Text style={styles.label}>{i18n.t('auth.name')}</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor={theme.colors.neutral[500]}
              value={name}
              onChangeText={setName}
              autoCorrect={false}
            />

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

            <Text style={styles.termsText}>{i18n.t('auth.termsAndConditions')}</Text>
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={theme.colors.neutral[100]} />
            ) : (
              <Text style={styles.signUpButtonText}>{i18n.t('auth.signUp')}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>{i18n.t('auth.alreadyHaveAccount')}</Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={styles.loginLink}>{i18n.t('auth.signIn')}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
  termsText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    marginTop: theme.spacing.sm,
  },
  signUpButton: {
    backgroundColor: theme.colors.primary[600],
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadow.medium,
  },
  signUpButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[100],
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
  },
  loginText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[700],
    marginRight: theme.spacing.xs,
  },
  loginLink: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary[600],
  },
});
