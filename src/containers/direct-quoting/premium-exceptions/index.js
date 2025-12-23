import React, { useEffect, useState } from 'react';
import PremiumExceptionEntry from './entry';
import Api from 'api/requests';
import useTranslations from 'app/hooks/useTranslations';

const MODULE_KEY = `direct-quoting/premium-exceptions`;

const headers = [
  { text: 'cms_premiumExceptionsPage_columns_companyCarId' },
  { text: 'cms_premiumExceptionsPage_columns_minDriverAge' },
  { text: 'cms_premiumExceptionsPage_columns_maxDriverAge' },
  { text: 'cms_premiumExceptionsPage_columns_minLicenseYears' },
  { text: 'cms_premiumExceptionsPage_columns_maxLicenseYears' },
  { text: 'cms_premiumExceptionsPage_columns_maxClaims' },
  { text: 'cms_premiumExceptionsPage_columns_namedDriversOnly' },
  { text: 'cms_premiumExceptionsPage_columns_highRiskArea' },
  { text: 'cms_premiumExceptionsPage_columns_finalPrice' },
];

const PremiumExceptions = () => {
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
          <PremiumExceptionEntry key={`tableEntry-${data.id}-${index}`} data={data} />
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

export default PremiumExceptions;
