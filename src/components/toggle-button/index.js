import './index.scss';

const ToggleButton = (props) => {
  const { text = false, id = '', name = '', checked = false, onChange = () => {}, disabled = false } = props;

  const onInputChange = () => {
    if (disabled) {
      return;
    }

    const event = { name: name, checked: !Boolean(checked) };
    onChange(event);
  };

  return (
    <div className="toggle-button-wrapper">
      {text && <span className="toggle-text">{text}</span>}

      <div className="toggle-label-wrapper">
        <label className={`toggle ${disabled ? 'disabled' : ''}`} htmlFor={id || name}>
          <input className="toggle-input" type="checkbox" name={name} checked={Boolean(checked)} id={id || name}
                 onChange={onInputChange} disabled={disabled} />
          <div className="toggle-fill"></div>
        </label>
      </div>
    </div>
  );
};

export default ToggleButton;
