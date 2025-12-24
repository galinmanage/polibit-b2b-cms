import React from 'react';
import { formatILS } from 'app/functions';
import useTranslations from 'app/hooks/useTranslations';

const BasePremiumEntry = ({ data = {} }) => {
  const translate = useTranslations();

  return (
    <tr className="table-row">
      <td className="table-cell center">{data.companyCarId}</td>
      <td className="table-cell center">{data.insuranceCompany}</td>
      <td className="table-cell center">{data.insurancePath}</td>
      <td className="table-cell center">{data.leviItzhakCode}</td>
      <td className="table-cell center">{data.modelYear}</td>
      <td className="table-cell center">{formatILS(data.basePrice)}</td>
      <td className="table-cell center">{data.protectionType}</td>
      <td className="table-cell center">
        {data.isActive ? translate('cms_generic_yes') : translate('cms_generic_no')}
      </td>
    </tr>
  );
};

export default BasePremiumEntry;
