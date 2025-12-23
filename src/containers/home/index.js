import { default as ROUTES, default as Routes } from 'constants/routes';
import SILENT_LOGIN from 'constants/silentLogin';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Outlet, useNavigate } from 'react-router-dom';
import { conditionalClassName, getMenuRoutes } from '../../app/functions';
import useTranslations from '../../app/hooks/useTranslations';
import CustomBreadCrumbs from '../../components/common/customBreadCrumbs';
import MenuItem from '../../components/menuItem';
import Actions from '../../redux/actions';
import './index.scss';

const Home = (props) => {
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.userData);
  const homePageBurger = useSelector((store) => store.homePageBurger);
  const translate = useTranslations();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const footerVersionTranslationTemplate = translate('cms_footer_version');
  const footerVersionTranslation = Array.isArray(
    footerVersionTranslationTemplate,
  )
    ? footerVersionTranslationTemplate[0]
    : footerVersionTranslationTemplate;

  const handleLogout = () => {
    localStorage.removeItem(SILENT_LOGIN.localStorageName);
    dispatch(Actions.setUser(false));
    navigate(ROUTES.LOGIN.path);
  };

  // THIS IS THE LOGOUT OBJECT TO SHOW ON MENU
  const logoutObj = {
    text: 'cms_nav_bar_logout',
    onClick: handleLogout,
    isProtected: false,
    showOnMenu: true,
    permissions: 0,
    subs: {},
  };

  const menuList = Object.keys(Routes)
    .map((route) => {
      const thisRoute = Routes[route];
      const { isProtected = false } = thisRoute;
      let menuRoutes;
      if (isProtected && userData) {
        menuRoutes = getMenuRoutes(1, thisRoute.subs, userData);
      }
      // PUSH THE LOGOUT OBJECT TO SHOW IT ON MENU
      Array.isArray(menuRoutes) && menuRoutes.push(logoutObj);
      return menuRoutes;
    })
    .filter((route) => typeof route !== 'undefined');

  const closeBurgerMenuOnDesktop = () => {
    dispatch(Actions.toggleBurger());
  };

  function sideBarMenu(menu) {
    return (
      <div className={'menu-list'}>
        {menu.map((menuItem, index) => {
          return (
            <MenuItem
              key={`nav-item-${menuItem.text}-${index}`}
              {...menuItem}
              // handleCloseClick={handleCloseClick}
            />
          );
        })}
      </div>
    );
  }

  const openClassName = homePageBurger ? 'open' : '';
  return (
    <div className="home-wrapper">
      <div
        className={`side-nav-fixed-container${conditionalClassName(
          openClassName,
        )}`}
      >
        <div className="backdrop" onClick={closeBurgerMenuOnDesktop} />
        <div className={`side-nav-wrapper`}>
          <div className={'nav-content'}>{sideBarMenu(menuList[0])}</div>
          <span dir="auto" className={'main-version'}>
            {footerVersionTranslation?.replace(
              '{version}',
              process.env.REACT_APP_SITE_VERSION,
            )}
          </span>
        </div>
      </div>
      <section className="main-content-section">
        <CustomBreadCrumbs path={pathname} />
        <Outlet />
      </section>
    </div>
  );
};

export default Home;
