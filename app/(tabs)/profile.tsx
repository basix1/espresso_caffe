import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, globalStyles } from '../../constants/theme';
import i18n from '../../i18n';
import { useAuth } from '../../hooks/useAuth';
import { useBluetooth } from '../../hooks/useBluetooth';
import LanguageSelector from '../../components/LanguageSelector';
import { Camera, Bell, Bluetooth, Info, LogOut, Sliders } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { launchImageLibrary } from 'react-native-image-picker';
import HeartLogo from '../../components/HeartLogo';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';


type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function ProfileScreen() {
  
  const { user, signOut, updateUser } = useAuth();
  const { detectionRange, setDetectionRange } = useBluetooth();
  const navigation = useNavigation<NavigationProp>();

  const [notifications, setNotifications] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.locale);

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        await updateUser({ avatar: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    i18n.locale = languageCode;
  };

  const handleSignOut = async () => {
    await signOut();
    navigation.navigate('Login'); // o il nome della tua screen iniziale
  };

  const toggleNotifications = () => {
    setNotifications(prev => !prev);
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView style={styles.container}>
        <Animated.View entering={FadeIn.duration(500)}>
          <View style={styles.header}>
            <HeartLogo size={40} animated={false} withText={false} />
            <Text style={styles.title}>{i18n.t('profile.myProfile')}</Text>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri:
                    user?.avatar ||
                    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                <Camera size={20} color={theme.colors.neutral[100]} />
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>{user?.name || 'Demo User'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n.t('profile.settings')}</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Bell size={24} color={theme.colors.primary[600]} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>{i18n.t('profile.notifications')}</Text>
                <Switch
                  value={notifications}
                  onValueChange={toggleNotifications}
                  trackColor={{
                    false: theme.colors.neutral[300],
                    true: theme.colors.primary[500],
                  }}
                  thumbColor={theme.colors.neutral[100]}
                />
              </View>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Bluetooth size={24} color={theme.colors.primary[600]} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>{i18n.t('profile.detectionRange')}</Text>
                <Text style={styles.rangeValue}>
                  {i18n.t('profile.detectionRangeValue', { value: detectionRange })}
                </Text>
              </View>
            </View>

            <View style={styles.rangeSliderContainer}>
              <Text style={styles.rangeLabel}>10m</Text>
              <View style={styles.sliderTrack}>
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${((detectionRange - 10) / (100 - 10)) * 100}%` },
                  ]}
                />
                <TouchableOpacity
                  style={[
                    styles.sliderThumb,
                    { left: `${((detectionRange - 10) / (100 - 10)) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.rangeLabel}>100m</Text>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Sliders size={24} color={theme.colors.primary[600]} />
              </View>
              <View style={styles.settingFullContent}>
                <Text style={styles.settingLabel}>{i18n.t('profile.language')}</Text>
                <LanguageSelector
                  onSelectLanguage={handleLanguageChange}
                  selectedLanguageCode={selectedLanguage}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n.t('profile.about')}</Text>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Info size={24} color={theme.colors.primary[600]} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>{i18n.t('profile.privacyPolicy')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Info size={24} color={theme.colors.primary[600]} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>{i18n.t('profile.termsOfService')}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Info size={24} color={theme.colors.primary[600]} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>{i18n.t('profile.version')}</Text>
                <Text style={styles.versionText}>1.0.0</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={20} color={theme.colors.primary[600]} />
            <Text style={styles.signOutText}>{i18n.t('profile.signOut')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ⬇️ Styles restano gli stessi — non li riscrivo per brevità


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.neutral[900],
    marginLeft: theme.spacing.sm,
  },
  profileCard: {
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadow.medium,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.primary[500],
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary[600],
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.neutral[100],
  },
  userName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.neutral[900],
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadow.small,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingFullContent: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[800],
  },
  rangeValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary[600],
  },
  rangeSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  rangeLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    width: 30,
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.neutral[300],
    borderRadius: 3,
    marginHorizontal: theme.spacing.sm,
    position: 'relative',
  },
  sliderFill: {
    height: 6,
    backgroundColor: theme.colors.primary[500],
    borderRadius: 3,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary[600],
    position: 'absolute',
    top: -7,
    marginLeft: -10,
    ...theme.shadow.small,
  },
  versionText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    ...theme.shadow.small,
  },
  signOutText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary[600],
    marginLeft: theme.spacing.sm,
  },
});