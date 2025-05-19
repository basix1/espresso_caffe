import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { LANGUAGES } from '../constants/languages';
import { theme } from '../constants/theme';
import i18n from '../i18n';
import { Language } from '../types';
import { ChevronDown } from 'lucide-react-native';

interface LanguageSelectorProps {
  onSelectLanguage: (languageCode: string) => void;
  selectedLanguageCode?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  onSelectLanguage,
  selectedLanguageCode = i18n.locale 
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const selectedLanguage = LANGUAGES.find(lang => lang.code === selectedLanguageCode) || LANGUAGES[0];

  const handleSelectLanguage = (language: Language) => {
    onSelectLanguage(language.code);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.languageText}>
          {selectedLanguage.flag} {selectedLanguage.nativeName}
        </Text>
        <ChevronDown size={18} color={theme.colors.neutral[700]} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{i18n.t('profile.language')}</Text>
            
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languageItem,
                    item.code === selectedLanguageCode && styles.selectedLanguageItem
                  ]}
                  onPress={() => handleSelectLanguage(item)}
                >
                  <Text style={styles.languageFlag}>{item.flag}</Text>
                  <Text style={[
                    styles.languageItemText,
                    item.code === selectedLanguageCode && styles.selectedLanguageItemText
                  ]}>
                    {item.nativeName}
                  </Text>
                  {item.code === selectedLanguageCode && (
                    <View style={styles.selectedIndicator} />
                  )}
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>{i18n.t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
  },
  languageText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[800],
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    ...theme.shadow.large,
  },
  modalTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  selectedLanguageItem: {
    backgroundColor: theme.colors.primary[100],
  },
  languageFlag: {
    fontSize: theme.typography.fontSize.xl,
    marginRight: theme.spacing.sm,
  },
  languageItemText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[800],
    flex: 1,
  },
  selectedLanguageItemText: {
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.primary[700],
  },
  selectedIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary[600],
  },
  closeButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary[600],
    borderRadius: theme.radii.md,
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[100],
  },
});

export default LanguageSelector;