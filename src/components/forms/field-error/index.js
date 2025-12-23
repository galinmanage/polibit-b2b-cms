import React from 'react';
import './index.scss';
import { clsx } from '../../../app/functions';

const FieldError = ({
  id,
  errorMessage = null,
  isThereError = false,
  centeredError = false,
  floatingError = false,
  className = undefined,
}) => {
  return (
    <div
      id={id}
      className={clsx(
        'field-error-wrapper',
        isThereError && 'visible',
        centeredError && 'centered',
        floatingError && 'floating',
        className,
      )}
      role={isThereError ? 'alert' : null}
    >
      <span className={'error-message'}>{errorMessage}</span>
    </div>
  );
};

export default FieldError;
