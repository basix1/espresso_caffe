import { I18n } from 'i18n-js';
import { DEFAULT_LANGUAGE } from '../constants/languages';

// Import translations
import en from './translations/en';
import it from './translations/it';
import es from './translations/es';
import fr from './translations/fr';
import de from './translations/de';

// Create i18n instance
const i18n = new I18n({
  en,
  it,
  es,
  fr,
  de
});

// Set the locale from device settings or default
i18n.defaultLocale = DEFAULT_LANGUAGE;
i18n.enableFallback = true;

export default i18n;