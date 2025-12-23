import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DropDown from '../../../assets/icons/drop-down.svg';

import './select.scss';

function Select(props) {
  const {
    label = '',
    options,
    disabled = false,
    mobileNativeSelect = false,
    selectedId = -1,
    onChange,
    name,
    className = '',
    showError = false,
    errorMessage = '',
    dropDownImg = DropDown,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState(-1);
  const [selectedItem, setSelectedItem] = useState({ id: -1, text: label });
  const deviceState = useSelector((state) => state.deviceState);
  const handleClick = (event) => {
    // hanles when user clicks the button
    const newState = !isOpen;
    setIsOpen(newState);
  };
  useEffect(() => {
    const text = getSelectedById(selectedId);
    if (text !== undefined) {
      setSelectedItem({ id: selectedId, text: text.text });
    }
  }, [selectedId]);

  const handleClickOutside = () => {
    // hanles when user clicks outside of the select

    setIsOpen(false);
  };
  const handleKeyUp = (event) => {
    let highlighted_item = highlightedItem;
    let selected_item = selectedItem;

    switch (event.key) {
      case 'ArrowDown':
        highlighted_item + 1 > options.length - 1
          ? (highlighted_item = 0)
          : highlighted_item++;

        setHighlightedItem(highlighted_item);
        break;

      case 'ArrowUp':
        highlighted_item - 1 < 0
          ? (highlighted_item = options.length - 1)
          : highlighted_item--;
        setHighlightedItem(highlighted_item);

        break;

      case 'Enter':
        selected_item = options[highlighted_item];

        setIsOpen(false);
        setSelectedItem(selected_item);
        setHighlightedItem(-1);
        break;

      case 'Escape':
        setIsOpen(false);
        setHighlightedItem(0);
        break;
      default:
        break;
    }
  };

  const handleOptionClick = (event) => {
    // hanles when user clicks an option

    let selected_item = null;

    if (event.target.tagName === 'SELECT') {
      selected_item = getSelectedByText(event.target.value);
    } else {
      selected_item = getSelectedById(event.target.id);
    }
    setSelectedItem(selectedItem);
    setIsOpen(false);
    onChange(name, selected_item.id);
  };

  function getSelectedByText(text) {
    let selected_item = options.find((item) => {
      return item.text === text;
    });
    return selected_item;
  }

  function getSelectedById(id) {
    let selected_item = options.find((item) => {
      return item.id === parseInt(id, 10);
    });
    return selected_item;
  }

  const activeClass = isOpen ? 'active' : '';
  const disabledClass = disabled ? 'disabled' : '';
  const startClass = selectedId === -1 ? ' start' : '';

  const useNativeSelect = !deviceState.isDesktop && mobileNativeSelect;
  let content = '';
  if (useNativeSelect) {
    content = (
      <div className={'select-wrapper ' + className}>
        <select
          value={selectedItem.text}
          className={startClass}
          onChange={handleOptionClick}
        >
          <option hidden>{selectedItem.text}</option>
          {options.map((item, index) => {
            return <option key={index}> {item.text} </option>;
          })}
        </select>
        {showError ? <div className="error-text">{errorMessage}</div> : ''}
      </div>
    );
  } else {
    content = (
      <div
        className={
          'select-wrapper ' +
          activeClass +
          (disabled ? ' disabled' : '') +
          ' ' +
          className
        }
        onBlur={handleClickOutside}
        onKeyUp={handleKeyUp}
      >
        <button
          className={'select_button ' + disabledClass + startClass}
          onClick={handleClick}
          type="button"
        >
          {selectedItem.text}
          <img src={dropDownImg} className="dropdown-img"></img>
        </button>

        <ul className="dropdown_menu">
          {options.map((item, index) => {
            let activeOption = '';
            let hightlightedOption = '';

            if (item.id === selectedItem.id) {
              activeOption = 'active';
            }

            if (index === highlightedItem) {
              hightlightedOption = ' highlight';
            }

            return (
              <li
                className={'select-option ' + activeOption + hightlightedOption}
                key={index}
                id={item.id}
                onMouseDown={handleOptionClick}
              >
                {item.text}
              </li>
            );
          })}
        </ul>
        {showError ? <div className="error-text">{errorMessage}</div> : ''}
      </div>
    );
  }

  return <>{content}</>;
}

export default Select;
