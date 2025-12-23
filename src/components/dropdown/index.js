import { conditionalClassName } from 'app/functions';
import useTranslations from 'app/hooks/useTranslations';
import { ReactComponent as CheckIcon } from 'assets/icons/check.svg';
import { useEffect, useRef, useState } from 'react';
import Button from '../button';
import './index.scss';

const Dropdown = (props) => {
  const optionsRef = useRef();
  const {
    options = [],
    name,
    className = '',
    onChange = () => {},
    multiple = false,
    multipleSelectionText = null,
    bitwise = false,
    value = 0,
    nameKey = 'text',
    placeholder = '',
    label = '',
    button = '',
    buttonClick = () => {},
    isTranslate = false,
    disabled = false,
    validOptions = true,
    errorMessage = '',
    showError = false,
    startsAtZero = false,
  } = props;

  const translate = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const onClickBody = (e) => {
      const { target } = e;
      if (!optionsRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', onClickBody);
    }
    return () => {
      if (isOpen) {
        document.removeEventListener('click', onClickBody);
      }
    };
  }, [isOpen]);
  const onChangeHandler = (e) => {
    const { name, value: Value } = e.target;

    if (bitwise) {
      const isEnabled = (Value & value) > 0;
      let res;

      if (Array.isArray(validOptions) && validOptions.length > 0) {
        if (validOptions.includes(Value)) {
          res = removeInvalidBitwiseSelections();
          res = isEnabled ? res & ~Value : Value | res;

          onChange(name, res);
          return;
        }

        return;
      }

      if (isEnabled) {
        res = value & ~Value;
      } else {
        res = Value | value;
      }

      onChange(name, res);
      return;
    }

    if (!multiple) {
      onChange(name, Value);
      onBlur();
    } else {
      let res = [...(value ? value : [])];
      if (res.includes(Value)) {
        res = res.filter((option) => option !== Value);
      } else {
        res.push(Value);
      }
      onChange(name, res);
    }
  };

  const removeInvalidBitwiseSelections = () => {
    let res = value;

    Object.entries(options).forEach(([key]) => {
      if (res & key && !validOptions.includes(parseInt(key))) {
        res = res & ~key;
      }
    });

    return res;
  };

  const onFocus = () => {
    if (isOpen) {
      return onBlur();
    }
    setIsOpen(true);
  };

  const onBlur = () => {
    setIsOpen(false);
  };

  const getInputValue = () => {
    if (startsAtZero && value === null) {
      return translate(options[0]);
    }

    if (((multiple || bitwise) && !value) || value === '' || (Array.isArray(value) && value.length === 0)) {
      return '';
    }

    if (options[value]?.[nameKey]) {
      return translate(options[value][nameKey]);
    }

    if (options?.[value]) {
      return translate(options[value]);
    }

    if (bitwise || multiple) {
      return translate(multipleSelectionText) ?? translate('cms_dropdown_multiple_are_selected');
    }

    return '';
  };

  const openClassName = isOpen ? 'open' : '';
  const isOptionsArray = Array.isArray(options);
  const inputValue = getInputValue();
  const translatedValue = isTranslate ? translate(inputValue) : inputValue;

  return (
    <div className={'drop'}>
      <div ref={optionsRef} className={`dropdown-wrapper${conditionalClassName(className)}`}>
        {label && <span className={'label'}>{label}</span>}

        <div className={'dropdown-input-wrapper'}>
          <div className={'dropdown-options-wrapper'}>
            <input
              name={name}
              className={'dropdown-input'}
              value={Array.isArray(translatedValue) ? translatedValue[0] : translatedValue}
              onClick={onFocus}
              onChange={() => {}}
              autoComplete={'off'}
              {...(placeholder && { placeholder: placeholder })}
              {...(disabled && { disabled: disabled })}
            />

            {!disabled && <span className={`arrow-button${conditionalClassName(openClassName)}`}>▼</span>}

            <div className={`options-wrapper${conditionalClassName(openClassName)}${label ? ' short' : ''}`}>
              {isOptionsArray
                ? options.length > 0 &&
                options.map((option, idx) => {
                  const data = {
                    option,
                    idx,
                    multiple,
                    name,
                    value,
                    onChangeHandler,
                    bitwise,
                    validOptions,
                    startsAtZero,
                  };
                  return <DropdownItem key={idx} data={data} />;
                })
                : Object.keys(options).length > 0 &&
                Object.entries(options).map(([id, option], idx) => {
                  const data = {
                    option,
                    id,
                    idx,
                    multiple,
                    name,
                    value,
                    onChangeHandler,
                    bitwise,
                    validOptions,
                    startsAtZero,
                  };
                  return <DropdownItem key={idx} data={data} />;
                })}
            </div>
          </div>

          {showError && <label className={'input-error'}>{errorMessage}</label>}
        </div>
      </div>
      {button && (
        <Button className={'additional-button'} onClick={buttonClick}>
          {button}
        </Button>
      )}
    </div>
  );
};

const DropdownItem = ({
  data: {
    option,
    id = null,
    idx,
    multiple,
    name,
    value,
    onChangeHandler,
    bitwise,
    validOptions,
    startsAtZero,
  },
}) => {
  const translate = useTranslations();
  if (!option) {
    return null;
  }


  const isOptionActive = () => {
    if (bitwise) {
      if (value === null && startsAtZero && parseInt(id) === 0) {
        return true;
      }

      return (parseInt(value) & parseInt(id)) > 0;
    }

    return !multiple ? parseInt(id ?? idx) === parseInt(value) : value?.includes?.(parseInt(id ?? idx));
  };

  const getOptionText = () => {
    const isOptionObjectAndEmpty = option && Object.keys(option).length === 0 && Object.getPrototypeOf(option) === Object.prototype;

    if (isOptionObjectAndEmpty) {
      return '';
    }

    if (option.name) {
      return translate(option.name);
    }

    if (option.text) {
      return translate(option.text);
    }

    const isValidOption = typeof option === 'string' || (Array.isArray(option) && option.length === 1) ? translate(option) : '';
    return isValidOption ?? '';
  };

  const optionText = getOptionText();
  const isActive = isOptionActive();
  const activeClassName = isActive ? 'active' : '';
  const syntheticEvent = { target: { name: name, value: parseInt(id ?? idx) } };
  const isSelected = (multiple || bitwise) && isActive;
  const isOptionSelectable = Array.isArray(validOptions) ? validOptions.includes(parseInt(id ?? idx)) : true;

  return (
    <button
      key={`dropdown-option-item-${name}-${idx}`}
      onClick={isOptionSelectable ? onChangeHandler.bind(this, syntheticEvent) : () => {}}
      className={`dropdown-option-item${conditionalClassName(activeClassName)}${optionText.length > 0 ? '' : ' none'}${
        isOptionSelectable ? '' : ' option-disabled'
      }`}
      title={optionText}
      type={'button'}
    >
      <div className="dropdown-option-text">{optionText}</div>
      {isSelected && (
        <div className={'checkmark-wrapper'}>
          <CheckIcon className={'checkmark-icon'} />
        </div>
      )}
    </button>
  );
};

export default Dropdown;
