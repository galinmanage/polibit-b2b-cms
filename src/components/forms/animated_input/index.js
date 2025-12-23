import React from 'react';
import { convertTimestampToDate } from '../../../app/functions';

import './index.scss';

/**
 *
 ## Animated input
 ## Input with animated place holder
 ##    parameters:
 ###      showError    - true / false, true = showing the error message
 ###      errorMessage - If input is wrong, show this text message
 ###      placeholder  - the animated string inside the input
 ###      onChange     - Needed to change the value
 ###      className    - Adding new class
 ###      autocomplete - true / false
 ###      value        - input value
 ###      name         - input name
 ###      type         - input type

 **/


function AnimatedInput(props, ref) {

  /*
      Props
  */
  const {
    id,
    autocomplete = true,
    disabled = false,
    placeholder = '',
    tabIndex = 10,
    errorMessage,
    value = '',
    className,
    showError,
    type,
    name,
    min = false,
    max = false,
  } = props;


  /*
      Text stay animated when input is not undefined
  */
  const animatedPlaceholder = (e) => {
    typeof props.onChange === 'function' && props.onChange(e);
  };

  let is_animated = value !== '' ? true : false;

  const isDateValue = type === 'date' && typeof value === 'number';

  const getMinMaxValue = (val) => {
    return typeof val === 'number' ? convertTimestampToDate(val) : val;
  };

  return (
    // Input wrapper
    <div className={'animated-input-wrapper ' + className}>
      {/* Input */}
      <input
        ref={ref}
        onChange={(e) => animatedPlaceholder(e)}
        autoComplete={autocomplete ? '' : 'off'}
        tabIndex={tabIndex}
        className={'input'}
        value={isDateValue ? convertTimestampToDate(value) : value}
        type={type}
        name={name}
        id={id}
        disabled={disabled}
        {...((type === 'date' && min) && { min: getMinMaxValue(min) })}
        {...((type === 'date' && max) && { max: getMinMaxValue(max) })}
      />
      {/* Placeholder */}
      <label htmlFor={id} className={'placeholder ' + (!is_animated ? '' : 'animated')}>
        {placeholder}
      </label>

      {/* Error message */}
      {
        showError &&
        <span className={'error-text'}>
                    {errorMessage}
                </span>
      }

    </div>
  );

}

export default React.forwardRef(AnimatedInput);
