import React from 'react';
import { formatILS } from 'app/functions';
import useTranslations from 'app/hooks/useTranslations';

const PremiumExceptionEntry = ({ data = {} }) => {
  const translate = useTranslations();

  return (
    <tr className="table-row">
      <td className="table-cell center">{data.company_car_id}</td>
      <td className="table-cell center">{data.min_driver_age}</td>
      <td className="table-cell center">{data.max_driver_age}</td>
      <td className="table-cell center">{data.min_license_years}</td>
      <td className="table-cell center">{data.max_license_years}</td>
      <td className="table-cell center">{data.max_claims_3y}</td>
      <td className="table-cell center">
        {data.named_drivers_only ? translate('cms_generic_yes') : translate('cms_generic_no')}
      </td>
      <td className="table-cell center">
        {data.is_high_risk_area ? translate('cms_generic_yes') : translate('cms_generic_no')}
      </td>
      <td className="table-cell center">{formatILS(data.final_price)}</td>
    </tr>
  );
};

export default PremiumExceptionEntry;
