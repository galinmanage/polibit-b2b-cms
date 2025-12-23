import React, { useEffect, useState } from 'react';
import BasePremiumEntry from './entry';
import Api from 'api/requests';
import useTranslations from 'app/hooks/useTranslations';

const MODULE_KEY = `direct-quoting/base-premiums`;

const headers = [
  { text: 'cms_basePremiumsPage_columns_companyCarId' },
  { text: 'cms_basePremiumsPage_columns_insuranceCompany' },
  { text: 'cms_basePremiumsPage_columns_insurancePath' },
  { text: 'cms_basePremiumsPage_columns_modelCode' },
  { text: 'cms_basePremiumsPage_columns_modelYear' },
  { text: 'cms_basePremiumsPage_columns_basePrice' },
  { text: 'cms_basePremiumsPage_columns_protectionType' },
  { text: 'cms_basePremiumsPage_columns_isActive' },
];

const BasePremiums = () => {
  const translate = useTranslations();

  const [data, setData] = useState([]);
  const [isFetchingDone, setIsFetchingDone] = useState(false);

  const initializeData = () => {
    Api.getCrudRequest(MODULE_KEY)
      .then((response) => {
        setData(response.data);
      })
      .finally(() => {
        setIsFetchingDone(true);
      });
  };

  useEffect(() => {
    initializeData();
  }, []);

  return (
    <table className="table-wrapper">
      <thead>
      <tr className="table-row header">
        {headers.map(({ text, width = 150 }, idx) => (
          <th key={`${text}-${idx}`} className="table-cell header">
            {translate(text)}
          </th>
        ))}
      </tr>
      </thead>
      <tbody>
      {data.length > 0 ? (
        Object.values(data).map((data, index) => (
          <BasePremiumEntry key={`tableEntry-${data.id}-${index}`} data={data} />
        ))
      ) : (
        <tr className="table-row no-result">
          <td colSpan={4} className="table-cell no-result">
            {isFetchingDone
              ? translate('cms_tableData_noResult')
              : translate('cms_tableData_fetching')}
          </td>
        </tr>
      )}
      </tbody>
    </table>
  );
};

export default BasePremiums;
