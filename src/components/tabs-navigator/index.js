import React from 'react';
import './index.scss';
import Link from '../link';

const TabNavigator = (props) => {
  const { tabs = [], id, className = '' } = props;

  return (
    <div className={'tabs-navigator-wrapper ' + (className)}>
      {tabs.map((tab, idx) => (
        <Link
          key={`${id}-tab-link-${idx}`}
          to={tab.path}
          className={'tab-navigator-item'}
          activeClassName={'active'}
        >
          {tab.text}
        </Link>
      ))}
    </div>
  );
};

export default TabNavigator;
