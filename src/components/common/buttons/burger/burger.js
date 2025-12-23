import React from 'react';
import './burger.css';
import burger_regular from 'assets/icons/burger.svg';

const Burger = ({ onClick }) =>
  <button className="burger_btn" onClick={onClick}>
    <img src={burger_regular} alt="תפריט" />
  </button>;
export default Burger;
