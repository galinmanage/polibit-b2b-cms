import React from 'react';

const PricingFactorEntry = ({ data = {} }) => (
  <tr className="table-row">
    <td className="table-cell center">{data.insuranceCompany}</td>
    <td className="table-cell center">{data.insurancePath}</td>
    <td className="table-cell center">{data.parameterType}</td>
    <td className="table-cell center">{data.parameterMinValue}</td>
    <td className="table-cell center">{data.parameterMaxValue}</td>
    <td className="table-cell center">{data.factor}</td>
    <td className="table-cell center">{data.comments || '-'}</td>
  </tr>
);

export default PricingFactorEntry;
