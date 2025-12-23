import React from 'react';
import './index.scss';
import { conditionalClassName } from '../../app/functions';

const Button = (props) => {
  const { children, onClick = () => {}, className = '', disabled = false } = props;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`button-wrapper${conditionalClassName(className)}`}
    >
      {children}
    </button>
  );
};

export default Button;
