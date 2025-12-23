import { convertDateToTimeStamp } from 'app/functions';
import useGetExcelLink from 'app/hooks/useGetExcelLink';
import useTranslations from 'app/hooks/useTranslations';
import Excel from 'assets/icons/excel.svg';
import { useState } from 'react';
import './index.scss';

const ERROR_LINK_TIMEOUT = 750;

const DATE_TYPES = {
  fromDate: 'from_date',
  toDate: 'to_date',
};

const ExcelButton = (props) => {
  const { data = {}, methodName = '' } = props;
  const getExcelLink = useGetExcelLink(methodName);
  const translate = useTranslations();
  const [isLinkError, setIsLinkError] = useState(false);

  const handleLinkError = () => {
    setIsLinkError(true);

    setTimeout(() => {
      setIsLinkError(false);
    }, ERROR_LINK_TIMEOUT);
  };

  const handleButtonClick = () => {
    const formattedData = {
      ...data,
      ...(data?.[DATE_TYPES.fromDate] && { [DATE_TYPES.fromDate]: convertDateToTimeStamp(data?.[DATE_TYPES.fromDate], 'start') }),
      ...(data?.[DATE_TYPES.toDate] && { [DATE_TYPES.toDate]: convertDateToTimeStamp(data?.[DATE_TYPES.toDate], 'end') }),
    };

    getExcelLink({ data: formattedData, handleLinkError });
  };

  const buttonClassName = `excel-export-button ${isLinkError ? 'error-button' : ''}`.trim();

  return (
    <button onClick={handleButtonClick} className={buttonClassName}>
      <div className="icon-wrapper">
        <img src={Excel} alt="" />
      </div>

      <span className="export-button-text">{translate('export_to_excel_button')}</span>
    </button>
  );
};

export default ExcelButton;
