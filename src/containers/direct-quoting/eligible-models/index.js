import React, { useEffect, useState } from 'react';
import EligibleModelEntry from './entry';
import Api from 'api/requests';
import useTranslations from 'app/hooks/useTranslations';

const MODULE_KEY = `direct-quoting/eligible-models`;

const headers = [
  { text: 'cms_eligibleModelsPage_columns_modelCode' },
  { text: 'cms_eligibleModelsPage_columns_modelYear' },
];

const EligibleModels = () => {
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
          <EligibleModelEntry key={`tableEntry-${data.id}-${index}`} data={data} />
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

export default EligibleModels;
