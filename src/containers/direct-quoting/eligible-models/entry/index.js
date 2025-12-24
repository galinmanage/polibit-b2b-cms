import React from 'react';

const EligibleModelEntry = ({ data = {} }) => (
  <tr className="table-row">
    <td className="table-cell center">{data.leviItzhakCode}</td>
    <td className="table-cell center">{data.modelYear}</td>
  </tr>
);

export default EligibleModelEntry;
