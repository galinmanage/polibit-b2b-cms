import React from 'react';

const ApiRoutedCompanyEntry = ({ data = {} }) => (
  <tr className="table-row">
    <td className="table-cell center">{data.insuranceCompany}</td>
  </tr>
);

export default ApiRoutedCompanyEntry;
