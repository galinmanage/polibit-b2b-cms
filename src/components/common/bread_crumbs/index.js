import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import './index.scss';

const BreadCrumbs = ({ root = '', className = '', crumbs = [] }) => {
  const location = useLocation();

  const printBreadCrumbs = () => {
    const path = location.pathname.split('/').slice(1);
    let res = [];

    if (crumbs.length > 0) {
      res.push(<NavLink key={root.text} to={root.route}>{root.text}</NavLink>);

      crumbs.forEach((item, index) => {
        res.push(<NavLink key={index} to={item.route}>{item.text}</NavLink>);
      });
    } else if (path.length > 0) {
      res.push(<NavLink key={root.text} to={root.route}>{root.text}</NavLink>);

      path.forEach((item, index) => {
        res.push(
          <span key={index}>{item}</span>,
        );
      });
    }

    return res;
  };

  return (
    <div className={'bread-crumbs ' + className}>
      {printBreadCrumbs()}
    </div>
  );
};

export default BreadCrumbs;
