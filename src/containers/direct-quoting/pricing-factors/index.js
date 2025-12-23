import React, { useEffect, useState } from 'react';
import PricingFactorEntry from './entry';
import Api from 'api/requests';
import useTranslations from 'app/hooks/useTranslations';

const MODULE_KEY = `direct-quoting/pricing-factors`;

const headers = [
  { text: 'cms_pricingFactorsPage_columns_insuranceCompany' },
  { text: 'cms_pricingFactorsPage_columns_insurancePath' },
  { text: 'cms_pricingFactorsPage_columns_parameterType' },
  { text: 'cms_pricingFactorsPage_columns_parameterMinValue' },
  { text: 'cms_pricingFactorsPage_columns_parameterMaxValue' },
  { text: 'cms_pricingFactorsPage_columns_factor' },
  { text: 'cms_pricingFactorsPage_columns_comments' },
];

const PricingFactors = () => {
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
          <PricingFactorEntry key={`tableEntry-${data.id}-${index}`} data={data} />
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

export default PricingFactors;
