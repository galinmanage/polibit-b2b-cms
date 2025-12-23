import React from 'react';

const EligibleModelEntry = ({ data = {} }) => (
  <tr className="table-row">
    <td className="table-cell center">{data.levi_itzhak_code}</td>
    <td className="table-cell center">{data.model_year}</td>
  </tr>
);

export default EligibleModelEntry;
