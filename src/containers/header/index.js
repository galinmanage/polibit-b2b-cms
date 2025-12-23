import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

//Components
import PageScroller from '../../components/page_scroller';

//Assets
import burger from 'assets/icons/burger.svg';
import logo from 'assets/logos/qualla-logo.svg';
import './index.scss';

//routing constants
import Routes from 'constants/routes';

//Actions
import Actions from '../../redux/actions';
import useTranslations from '../../app/hooks/useTranslations';

import { getMenuRoutes } from '../../app/functions';
import Link from '../../components/link';

function Header() {
  const deviceState = useSelector((store) => store.deviceState);
  const userData = useSelector((store) => store.userData);

  const translate = useTranslations();
  const dispatch = useDispatch();

  const handleBurgerClick = () => {
    dispatch(Actions.setBurger(true));
  };

  const { pathname } = useLocation();

  const [shownBtn, setShownBtn] = useState(null);

  // useEffect(() => {
  //     setShownBtn(pageScrollerState && pathname === Routes.DOCS_HEADER.page_scroller)
  // }, [pageScrollerState, Routes.DOCS_HEADER.page_scroller])

  const handleDesktopBurger = () => {
    dispatch(Actions.toggleBurger());
  };

  const menuList = Object.keys(Routes)
    .map((route) => {
      const thisRoute = Routes[route];
      const { isProtected = false } = thisRoute;
      let menuRoutes;
      if (isProtected && userData) {
        menuRoutes = getMenuRoutes(1, thisRoute.subs, userData);
      }
      return menuRoutes;
    })
    .filter((route) => typeof route !== 'undefined');

  const name = userData?.firstName ?? '';


  return (
    <header className="header-wrapper">
      <PageScroller />
      <div className="header">
        <div className="user-data-logo-wrapper">
          <div className="nav-container">
            {userData ? (
              <div className="burger-icon" onClick={deviceState.isDesktop ? handleDesktopBurger : handleBurgerClick}>
                <img src={burger} alt="" />
              </div>
            ) : null}

            {deviceState.isDesktop && userData ? (
              <p>
                {translate('cms_hello')}
                {name}
              </p>
            ) : null}
          </div>

          <Link to={Routes.ROOT.path}>
            <img src={logo} className="logo" alt="" />
          </Link>
        </div>

        {!!userData && <div className="gradient" />}
      </div>
    </header>
  );
}

export default Header;
