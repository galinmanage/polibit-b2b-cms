import React from 'react';

import './checkbox.scss';

const Checkbox = (props) => {
  const {
    className,
    type,
    id,
    name,
    label = '',
    value = '',
    onChange,
    showError = false,
    errorMessage = '',
    emptyImage,
    checkedImage,
  } = props;

  function doesPhotoExsits() {
    return emptyImage !== undefined || checkedImage !== undefined;
  }

  const img = value ? <img src={checkedImage} /> : <img src={emptyImage} />;

  const isStyled = doesPhotoExsits();
  const styledImages = isStyled ? img : '';
  const labelClass = isStyled ? 'styled' : '';

  return (
    <div className={'checkbox-wrapper' + ' ' + labelClass + ' ' + className}>
      <input
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
      />
      <label htmlFor={id}>
        {styledImages}

        {label}
      </label>
      {showError ? <div className="error-text">{errorMessage}</div> : ''}
    </div>
  );
};
export default Checkbox;
