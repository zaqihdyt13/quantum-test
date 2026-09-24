import i18n, { Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'

import resourcesEn from '@/locales/en'
import resourcesId from '@/locales/id'

const resources: Resource = {
  id: resourcesId,
  en: resourcesEn,
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'id',
  supportedLngs: ['id', 'en'],
  fallbackLng: 'id',
  partialBundledLanguages: true,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
