import React, { useState } from 'react';
import { generateUniqueId } from 'app/functions';

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


function AnimatedTextArea(props) {

  const [animated, setAnimated] = useState(false);

  /*
      Props
  */
  const {
    errorMessage = 'Please fill out this field',
    id = generateUniqueId(16),
    placeholder = '',
    tabIndex = 10,
    value = '',
    className,
    showError,
    type,
    name,
  } = props;

  /*
      Text stay animated when input is not undefined
  */
  const animatedPlaceholder = (e) => {
    let val = e.target.value;
    props.onChange(e);
  };

  let is_animated = value !== '' ? true : false;

  return (
    /*
        Text area wrapper
    */
    <div className={'animated-textarea-wrapper ' + className}>

      {/*
            Text area
          */}
      <textarea
        onChange={(e) => animatedPlaceholder(e)}
        className={'textarea'}
        tabIndex={tabIndex}
        value={value}
        name={name}
        type={type}
        id={id}
      />

      {/*
            Placeholder
          */}
      <label htmlFor={id} className={'placeholder ' + (!is_animated ? '' : 'animated')}>{placeholder}</label>

      {/*
            Error message
          */}
      {
        showError &&
        <span className={'error-text'}>
                      {errorMessage}
                  </span>
      }
    </div>
  );
}

export default AnimatedTextArea;

