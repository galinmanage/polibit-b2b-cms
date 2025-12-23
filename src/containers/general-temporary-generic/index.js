import React from 'react';
import './index.scss';
import { useParams } from 'react-router-dom';

const ClientGeneral = (props) => {
  const params = useParams();
  const { clientId } = params;
  return (
    <div className={'lead-general-wrapper'}>
      Client ID: {clientId}
    </div>
  );
};

export default ClientGeneral;
