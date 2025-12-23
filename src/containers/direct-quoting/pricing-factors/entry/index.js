import React from 'react';

const PricingFactorEntry = ({ data = {} }) => (
  <tr className="table-row">
    <td className="table-cell center">{data.insurance_company}</td>
    <td className="table-cell center">{data.insurance_path}</td>
    <td className="table-cell center">{data.parameter_type}</td>
    <td className="table-cell center">{data.parameter_min_value}</td>
    <td className="table-cell center">{data.parameter_max_value}</td>
    <td className="table-cell center">{data.factor}</td>
    <td className="table-cell center">{data.comments || '-'}</td>
  </tr>
);

export default PricingFactorEntry;
