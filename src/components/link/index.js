import { NavLink } from 'react-router-dom';

const Link = (props) => {
  const { activeClassName = '', className = '', to = '', children, onClick = () => {} } = props;

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `${className}${isActive ? ' ' + activeClassName : ''}`}
    >
      {children}
    </NavLink>
  );
};

export default Link;
