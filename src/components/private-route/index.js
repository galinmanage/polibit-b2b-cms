import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import ROUTES from '../../constants/routes';

const PrivateRoute = (props) => {
  const userData = useSelector((store) => store.userData);
  return userData ? <AuthRoute {...props} /> : <Navigate to={ROUTES.LOGIN.path} />;
};

export default PrivateRoute;

function AuthRoute(props) {
  const location = useLocation();
  if (location.pathname === ROUTES.LOGIN.path) {
    return <Navigate to={ROUTES.ROOT.path} />;
  }

  const { Container } = props;
  return Container;
}
