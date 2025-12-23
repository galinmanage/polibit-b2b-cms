import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';

export default function Card(props) {
  const {
    index,
    className = '',
    amount = 0,
    title = 'title',
    extraText = 'extraText',
    clickText = '',
    path = '/',
    style = false,
  } = props;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(path, { state: { statusId: index } });
  };

  return (
    <div className={'card-container ' + className} onClick={handleCardClick} {...(style && { style: style })}>
      <div className={'data'}>
        <h1 className={'amount-text'}>{amount}</h1>
        <h3 className={'title'}>{title}</h3>
        <h3 className={'extra-text'}>{extraText}</h3>
      </div>
      <span className={'click-here'}>
                {clickText}
        {title}
            </span>
    </div>
  );
}
