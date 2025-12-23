import React from 'react';
import { formatILS } from 'app/functions';
import useTranslations from 'app/hooks/useTranslations';

const BasePremiumEntry = ({ data = {} }) => {
  const translate = useTranslations();

  return (
    <tr className="table-row">
      <td className="table-cell center">{data.company_car_id}</td>
      <td className="table-cell center">{data.insurance_company}</td>
      <td className="table-cell center">{data.insurance_path}</td>
      <td className="table-cell center">{data.levi_itzhak_code}</td>
      <td className="table-cell center">{data.model_year}</td>
      <td className="table-cell center">{formatILS(data.base_price)}</td>
      <td className="table-cell center">{data.protection_type}</td>
      <td className="table-cell center">
        {data.is_active ? translate('cms_generic_yes') : translate('cms_generic_no')}
      </td>
    </tr>
  );
};

export default BasePremiumEntry;
