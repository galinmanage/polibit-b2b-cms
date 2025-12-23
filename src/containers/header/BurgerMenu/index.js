import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Actions from 'redux/actions';
import './index.scss';
import useTranslations from '../../../app/hooks/useTranslations';
import MenuItem from '../../../components/menuItem';

export default function BurgerMenu(props) {
  const { data } = props;
  const state = useSelector(store => store.burgerState);
  const translate = useTranslations();
  const dispatch = useDispatch();

  const handleCloseClick = (e, shouldClose) => {
    e.preventDefault();
    e.stopPropagation();
    if (shouldClose) {dispatch(Actions.setBurger(false));}
  };

  return (
    <div className={'burger-menu-wrapper ' + (state ? 'active' : '')}
         onClick={(e) => handleCloseClick(e, true)}
    >
      <div className="burger-menu"
           onClick={(e) => handleCloseClick(e, false)}
      >
        <h3 className={'burger-hello'}>{translate('cms_hello')} שם פרטי</h3>
        <ul className="burger-menu-list">
          {
            data.map((menuItem, index) => {
              return (
                <MenuItem
                  key={index}
                  {...menuItem}
                  // handleCloseClick={handleCloseClick}
                />
              );
            })
          }
        </ul>
      </div>
    </div>
  );
}
