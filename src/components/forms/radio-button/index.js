import './radiobutton.scss';

function RadioButton(props) {
  const {
    className,
    options,
    name,
    value,
    onChange,
    showError = false,
    errorMessage = '',
    emptyImage,
    checkedImage,
  } = props;

  function onChangeHandler(event) {
    const id = event.target.id;
    onChange(name, id);
  }

  function doesPhotoExsits() {
    return emptyImage !== undefined || checkedImage !== undefined;
  }

  // const isChecked = value === id ? true : false;
  let img = value ? (
    <img className="radio-img" src={checkedImage} />
  ) : (
    <img className="radio-img" src={emptyImage} />
  );

  function getCorrectImage(id) {
    if (id === value) {
      return <img className="radio-img" src={checkedImage} />;
    } else {
      return <img className="radio-img" src={emptyImage} />;
    }
  }

  function getContentBasedOnDoesPhotoExsits(id) {
    if (isStyled) {
      return getCorrectImage(id);
    } else {
      return (
        <div className="default-radio">
          <span className="dot"></span>
        </div>
      );
    }
  }

  const isStyled = doesPhotoExsits();
  let content = '';

  return (
    <div className={'radios-wrapper ' + className}>
      {options.map((item) => (
        <div key={item.id} className="radio-wrapper">
          <input
            className="radio"
            type="radio"
            name={name}
            id={item.id}
            onChange={onChangeHandler}
          />
          <label htmlFor={item.id} className="label-radio">
            {getContentBasedOnDoesPhotoExsits(item.id)}

            {item.text}
          </label>
        </div>
      ))}

      {showError ? <div className="error-text">{errorMessage}</div> : ''}
    </div>
  );
}

export default RadioButton;
