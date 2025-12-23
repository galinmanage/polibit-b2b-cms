import Api from 'api/requests';
import { EXCEL_EXPORT_KEY } from 'constants/export-to-excel';

const useGetExcelLink = (methodName = '') => {
  const getExcelLink = ({ data, onSuccess = false, handleLinkError = () => {} }) => {
    if (!methodName || typeof Api[methodName] !== 'function') {
      return;
    }

    const handleSuccess = (res) => {
      if (typeof onSuccess === 'function') {
        onSuccess(res);
        return;
      }

      const excelUrl = res.excel_file_url ?? res.data?.excel_file_url ?? false;

      if (!excelUrl) {
        handleLinkError();
        return;
      }

      window.open(excelUrl);
    };

    const props = {
      payload: {
        ...data,
        [EXCEL_EXPORT_KEY]: 1,
      },
      onSuccess: handleSuccess,
    };

    Api[methodName](props);
  };

  return getExcelLink;
};

export default useGetExcelLink;
