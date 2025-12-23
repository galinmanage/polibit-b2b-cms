import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import SILENT_LOGIN from 'constants/silentLogin';
//routing constants
import ROUTES from 'constants/routes';
import routes from 'constants/routes';

//import components
import Header from 'containers/header';
import ScreenLoader from './components/common/loaders/screen';

//Import containers
import Popups from 'popups';
//css
import 'styles/app.scss';
import 'styles/fonts.scss';
import PrivateRoute from './components/private-route';
import * as Containers from './containers';
import Actions from './redux/actions';
import { Bounce, ToastContainer } from 'react-toastify';

const App = (props) => {
  const deviceState = useSelector((store) => store.deviceState);
  const popupsArray = useSelector((store) => store.popupsArray);
  const requestingState = useSelector((store) => store.requestingState);
  const didSilentLogin = useSelector((store) => store.didSilentLogin);

  const [showLoader, setShowLoader] = useState(requestingState.length > 0);
  const [initialRequestsDone, setInitialRequestsDone] = useState(false);
  const [isGdDone, setIsGdDone] = useState(false);
  const [startingLoadingTime, setStartingLoadingTime] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getUserData();
    setInitialRequestsDone(true);
    setIsGdDone(true);
  }, []);

  useEffect(() => {
    if (!isGdDone) {
      return;
    }

    if (requestingState.length > 0) {
      setShowLoader(true);

      if (startingLoadingTime === 0) {
        setStartingLoadingTime(new Date().getTime());
      }
    } else {
      const currentTime = new Date().getTime();
      const diff = currentTime - startingLoadingTime;
      const minDelay = 500;

      setTimeout(
        () => {
          setShowLoader(false);
          setStartingLoadingTime(0);
        },
        diff < minDelay ? minDelay - diff : 0,
      );
    }
  }, [requestingState, isGdDone, startingLoadingTime]);

  const getUserData = () => {
    const userDataString = localStorage.getItem(SILENT_LOGIN.localStorageName);

    if (userDataString) {
      const userData = JSON.parse(userDataString);
      dispatch(Actions.setUser(userData));
      dispatch(Actions.setSilentLogin(true));
      return;
    }

    navigate(ROUTES.LOGIN.path);
    dispatch(Actions.setSilentLogin(true));
  };

  const renderRoutesTree = (routes) => {
    const res = [];
    if (Object.keys(routes).length > 0) {
      for (const route of Object.keys(routes)) {
        const {
          isProtected = false,
          component = '',
          path,
          index,
        } = routes[route];
        const Element = Containers[component];
        const Component = isProtected ? (
          <PrivateRoute Container={<Element />} />
        ) : (
          <Element />
        );
        const IndexComponent = index ? Containers[index] : undefined;

        res.push(
          <Route
            path={path}
            element={Component}
            key={`main-site-route-${route}`}
          >
            {IndexComponent && <Route index element={<IndexComponent />} />}
            {renderRoutesTree(routes[route].subs)}
          </Route>,
        );
      }
    }
    return res;
  };

  const showPopup = popupsArray.length > 0;
  const renderPage = deviceState && initialRequestsDone && didSilentLogin;

  return (
    <div className="App">
      {renderPage && (
        <>
          <Header />

          {/* main routing table */}
          <Routes>{renderRoutesTree(routes)}</Routes>

          {/* make sure new page scroll position is at the top */}
          {/*<ScrollToTop />*/}

          {/* render meta tags from the server */}
          {/*<MetaTags />*/}
        </>
      )}
      {/* main modal component */}
      {showPopup && <Popups />}

      {/* full page loader */}
      {(requestingState.length > 0 || !isGdDone || showLoader) && (
        <ScreenLoader />
      )}
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
};

export default App;
