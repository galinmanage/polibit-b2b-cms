import React from 'react';
import { formatILS } from 'app/functions';
import useTranslations from 'app/hooks/useTranslations';

const PremiumExceptionEntry = ({ data = {} }) => {
  const translate = useTranslations();

  return (
    <tr className="table-row">
      <td className="table-cell center">{data.companyCarId}</td>
      <td className="table-cell center">{data.minDriverAge}</td>
      <td className="table-cell center">{data.maxDriverAge}</td>
      <td className="table-cell center">{data.minLicenseYears}</td>
      <td className="table-cell center">{data.maxLicenseYears}</td>
      <td className="table-cell center">{data.maxClaims3y}</td>
      <td className="table-cell center">
        {data.namedDriversOnly ? translate('cms_generic_yes') : translate('cms_generic_no')}
      </td>
      <td className="table-cell center">
        {data.isHighRiskArea ? translate('cms_generic_yes') : translate('cms_generic_no')}
      </td>
      <td className="table-cell center">{formatILS(data.finalPrice)}</td>
    </tr>
  );
};

export default PremiumExceptionEntry;
