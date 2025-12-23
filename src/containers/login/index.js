import Api from 'api/requests';
import popupTypes from 'constants/popup-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Validate from '../../app/validation/validation';
import Actions from '../../redux/actions';
import './index.scss';
import LoginForm from './loginForm';
import SILENT_LOGIN from 'constants/silentLogin';
import ROUTES from 'constants/routes';

const Login = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.userData);
  const [loginForm, setLoginForm] = useState({
    email: {
      valid: false,
      rules: ['email', 'not_empty'],
      errMsg: '',
      value: '',
    },
    password: {
      valid: false,
      rules: ['not_empty'],
      errMsg: '',
      value: '',
    },
  });

  useEffect(() => {
    if (userData) {
      navigate('/');
    }
  }, [userData]);

  function handleLoginFormChange(e) {
    let name = e.target.name;
    let val = e.target.value;
    let validationObj = Validate(val, loginForm[name].rules);
    let new_form = { ...loginForm };
    new_form[name].valid = validationObj.valid;
    new_form[name].errMsg = validationObj.msg;
    new_form[name].value = val;
    setLoginForm(new_form);
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    let form_valid = true;
    let new_form = { ...loginForm };
    let validationObj;

    for (let field in loginForm) {
      validationObj = Validate(loginForm[field].value, loginForm[field].rules);
      new_form[field].valid = validationObj.valid;
      new_form[field].errMsg = validationObj.msg;

      if (!validationObj.valid) {
        form_valid = false;
      }
    }
    setLoginForm(new_form);
    if (form_valid) {
      const onSuccess = (res) => {
        if (res.errors === false) {
          // Create complete user data object with all user data and token
          const userData = {
            ...res.data.user,
            [SILENT_LOGIN.apiRequestKey]: res.data.token,
          };

          // Store complete user data in localStorage
          localStorage.setItem(
            SILENT_LOGIN.localStorageName,
            JSON.stringify(userData),
          );

          // Update Redux state with complete user data
          dispatch(Actions.setUser(userData));
          navigate(ROUTES.ROOT.path);
        }
      };

      const onFailure = (err) => {
        const errorMessage = err?.errors?.[0]?.message || 'An error occurred';

        dispatch(
          Actions.addPopup({
            type: popupTypes.API_ERROR,
            payload: {
              text: errorMessage,
            },
          }),
        );
        dispatch(Actions.setLoader(false));
      };

      const props = {
        onSuccess,
        onFailure,
        payload: {
          email: new_form.email.value,
          password: new_form.password.value,
        },
      };
      Api.login(props);
    }
  }

  return (
    <div className={'login-page-wrapper'}>
      <div className={'login-page-content'}>
        <LoginForm
          onChange={handleLoginFormChange}
          onSubmit={handleLoginSubmit}
          showError={(field) => !loginForm[field].valid}
          emailErrorMessage={loginForm.email.errMsg}
          passwordErrorMessage={loginForm.password.errMsg}
          emailValue={loginForm.email.value}
          passwordValue={loginForm.password.value}
        />
      </div>
    </div>
  );
};

export default Login;
