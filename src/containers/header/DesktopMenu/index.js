import React from 'react';

import './index.scss';
import Link from 'components/link';
import useTranslations from 'app/hooks/useTranslations';

export default function DesktopMenu(props) {
  const translate = useTranslations();

  const getNavLinks = () => {
    let links = props.data.map((item, index) => {
      if (item.route !== '/') {

      }
      // let exact = {exact: menuSubItems.route === '/'};
      return (
        <Link to={item.route}
              activeClassName="active"
              className="desktop-menu-item"
              key={index}>
          <h4 className="menu-item">
            {translate(item.text)}
          </h4>
        </Link>
      );
    });
    return links;
  };

  return (
    <nav className="desktop-menu">
      {/*{ getNavLinks() }*/}
    </nav>
  );
}
