import translations from '../../translations.json';
import { useCallback } from 'react';

const useTranslations = () => {
  return useCallback((key) => {
    return translations[key] ?? key;
  }, [translations]);
};

export default useTranslations;
