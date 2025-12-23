import { useCallback } from 'react';
import useTranslations from './useTranslations';

const useDropdownData = (data, combine = false) => {
  const translate = useTranslations();

  const generateDropdownData = useCallback((key = '', objEntries = { key: 'id', value: 'name' }) => {
    let wholeData = {};

    if (!data) {
      return {};
    }

    if (Array.isArray(data) && combine) {
      for (let arr of data) {
        wholeData = { ...wholeData, ...arr };
      }
    } else {
      wholeData = data;
    }

    if (!wholeData || ((!Array.isArray(wholeData) && !wholeData[key] && (typeof wholeData !== 'object')))) {
      return [];
    }

    let res = {};

    if (Array.isArray(wholeData[key])) {
      wholeData[key].map((statusData) => {
        res = { ...res, [statusData[objEntries.key]]: translate(statusData[objEntries.value]) };
      });

      return res ?? {};
    }

    if (Array.isArray(wholeData)) {
      wholeData.map((statusData) => {
        res = { ...res, [statusData[objEntries.key]]: translate(statusData[objEntries.value]) };
      });

      return res ?? {};
    }

    Object.entries(wholeData[key] ?? wholeData).map(([id, value]) => {
      res = { ...res, [id]: translate(value) };
    });

    return res ?? {};
  }, [data]);

  return generateDropdownData;
};

export default useDropdownData;
