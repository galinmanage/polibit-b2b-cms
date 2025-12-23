import './index.scss';

const PopupButton = (props) => {
  const { children, className = '', onClick = false } = props;

  return (
    <div className={`popup-button-wrapper ${className}`}>
      <button className={'popup-button'} {...(onClick && { onClick: onClick })}>
        {children}
      </button>
    </div>
  );
};

export default PopupButton;
