import React, { useState } from 'react';
import './index.scss';
import Link from '../link';
import DropDownIcon from 'assets/icons/drop-down.svg';
import CustomCollapse from '../common/customCollapse';
import useTranslations from '../../app/hooks/useTranslations';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../redux/actions';

export default function MenuItem(
  {
    text,
    subs,
    level = 0,
    // handleCloseClick,
    path = '',
    onClick = () => {},
  },
) {
  const dispatch = useDispatch();
  const deviceState = useSelector(store => store.deviceState);
  const [dropDownActive, setDropDownActive] = useState(false);
  const toggleDropDown = () => {
    setDropDownActive(prev => !prev);
  };
  const translate = useTranslations();
  const isSubsExists = subs && subs.length > 0;

  const onItemSelect = () => {
    if (deviceState.isDesktop) {
      dispatch(Actions.toggleBurger());
    }
  };

  const renderLink = () => {
    return (
      <LinkWrapper path={path} hasSubs={isSubsExists} onItemClick={onItemSelect}>
        <li className={'menu-item'} style={{ marginLeft: level * 10 }}>
          <div
            className={'item-row'}
            onClick={
              isSubsExists
                ? () => {
                  toggleDropDown();
                }
                : () => {}
            }
          >
            <span>{translate(text)}</span>
            {isSubsExists ? <img className={'icon ' + (dropDownActive ? 'active' : '')} src={DropDownIcon} /> :
              <div></div>}
          </div>
          {isSubsExists && (
            <CustomCollapse open={dropDownActive}>
              <ul className={'sub-items level-' + level}>
                {subs.map((sub) => (
                  <MenuItem key={translate(text)} {...sub} level={level + 1} />
                ))}
              </ul>
            </CustomCollapse>
          )}
        </li>
      </LinkWrapper>
    );
  };

  const renderClickHandler = () => {
    const handleClick = () => {
      dispatch(Actions.toggleBurger());
      onClick();
    };

    return (
      <li className="link">
        <div className={'menu-item'} style={{ marginLeft: level * 10 }}>
          <div
            className={'item-row'}
            onClick={handleClick}
          >
            <span>{translate(text)}</span>
            {isSubsExists ? <img className={'icon ' + (dropDownActive ? 'active' : '')} src={DropDownIcon} /> :
              <div></div>}
          </div>
          {isSubsExists && (
            <CustomCollapse open={dropDownActive}>
              <ul className={'sub-items level-' + level}>
                {subs.map((sub) => (
                  <MenuItem key={translate(text)} {...sub} level={level + 1} />
                ))}
              </ul>
            </CustomCollapse>
          )}
        </div>
      </li>
    );
  };

  return path ? renderLink() : renderClickHandler();
}


const LinkWrapper = (props) => {
  const { children, hasSubs = false, path, onItemClick = () => {} } = props;

  return (
    hasSubs ? (
      <div className={'link'}>{children}</div>
    ) : (
      <Link
        to={path}
        activeClassName={'active'}
        className={'link'}
        onClick={onItemClick}
      >{children}</Link>
    )
  );
};
