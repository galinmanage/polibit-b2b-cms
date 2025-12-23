import React from 'react';

import './index.scss';

const TextInput = (props) => {

  const {
    type,
    name,
    className = '',
    placeholder = '',
    label = '',
    value = '',
    onChange,
    showError,
    errorMessage = 'empty or undefined errorMessage prop',
    tabIndex,
  } = props;

  return (
    <div className={'input_wrapper ' + className + ' ' + (showError ? 'error' : '')}>
      {label !== '' && <label> {label}:</label>}
      <input type={type}
             name={name}
             placeholder={placeholder}
             value={value}
             onChange={onChange}
             tabIndex={tabIndex}
      />
      {showError ? <div className="error_text">{errorMessage}</div> : ''}
    </div>
  );
};
export default TextInput;
