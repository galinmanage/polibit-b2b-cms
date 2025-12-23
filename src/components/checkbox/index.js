import React, { useRef } from 'react';
import './index.scss';
import { conditionalClassName } from '../../app/functions';
import checkboxTypes from '../../constants/checkboxTypes';

const Checkbox = (props) => {
  const {
    name,
    checked = false,
    value,
    onChange = () => {},
    disabled = false,
    className = '',
    style = checkboxTypes.BOX,
    label,
    labelClassName = '',
  } = props;
  const ref = useRef();

  const onLabelClickHandler = () => {
    ref.current.click();
  };

  const checkStyle = style === checkboxTypes.CHECK_MARK ? 'checkmark' : '';
  return (
    <div className={'custom-checkbox-wrapper'}>
      <input
        ref={ref}
        className={`custom-checkbox${conditionalClassName(checkStyle)}${conditionalClassName(className)}`}
        type={'checkbox'}
        name={name}
        checked={checked}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <label
        onClick={onLabelClickHandler}
        htmlFor={name}
        className={`custom-checkbox-label${conditionalClassName(labelClassName)}`}
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
