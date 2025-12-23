import React from 'react';
import useTranslations from '../../../app/hooks/useTranslations';
import AnimatedInput from '../../../components/forms/animated_input';
import './index.scss';

export default function LoginForm(props) {
  const translate = useTranslations();

  const {
    onChange,
    onSubmit,
    showError = false,
    emailValue = '',
    passwordValue = '',
    emailErrorMessage = '',
    passwordErrorMessage = '',
  } = props;

  return (
    <div className={'login-content'}>
      <h1 className={'login-title'}>{translate('cms_login_title')}</h1>
      <form onSubmit={onSubmit}>
        <AnimatedInput
          className={'custom-input'}
          name={'email'}
          value={emailValue}
          placeholder={translate('cms_login_email_title')}
          autocomplete
          onChange={onChange}
          showError={showError}
          errorMessage={emailErrorMessage}
        />
        <AnimatedInput
          className={'custom-input'}
          name={'password'}
          value={passwordValue}
          placeholder={translate('cms_login_password_title')}
          autocomplete
          onChange={onChange}
          showError={showError}
          type={'password'}
          errorMessage={passwordErrorMessage}
        />
        <button className={'submit-btn mt'}>
          <span className={'submit-btn-text'}>{translate('cms_login')}</span>
        </button>
      </form>
    </div>
  );
}
