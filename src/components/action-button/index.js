import React from 'react';
import './index.scss';

const ActionButton = (props) => {
  const { text, icon, onClick = () => {}, disabled = false } = props;
  return (
    <button className="action-button-wrapper" onClick={onClick} disabled={disabled}>
            <span className={'action-button-image-wrapper'}>
                <img className={'action-button-image'} src={icon} alt={'edit user'} />
            </span>
      <span className={'action-button-text'}>{text}</span>
    </button>
  );
};

export default ActionButton;
