import React, { useState } from 'react';

import './index.scss';


const AutoComplete = (props) => {

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedId, setHighlighted] = useState(0);
  const inputRef = React.createRef();

  const handleClickOutside = () => {
    setOpen(false);
  };
  const handleClick = (e) => {
    setOpen(!open);
  };
  const onChange = (e) => {
    setHighlighted(0);
    setQuery(e.target.value);
  };

  const handleOptionClick = (e, option) => {
    e.preventDefault();
    setOpen(false);
    setQuery(option.text);
    props.onSelect(option.id);
    inputRef.current.blur();
    setHighlighted(0);
  };
  const getList = () => {
    let list = [];

    let options = props.options.filter(option => option.text.indexOf(query) !== -1);

    for (let item in options) {
      let option = options[item];
      let highlightedOption = option.id === highlightedId ? ' highlight' : '';

      list.push(<li className={'auto-option ' + highlightedOption}
                    key={option.id}
                    id={option.id}
                    onMouseDown={(e) => handleOptionClick(e, option)}>
        {option.text}
      </li>);
    }
    return list;
  };
  const handleKeyDown = (event) => {
    event.stopPropagation();
    let highlighted_item;
    let options = props.options.filter(option => option.text.indexOf(query) !== -1);

    switch (event.key) {
      case('ArrowDown'):
        highlighted_item = (highlightedId + 1) > (options.length - 1) ? 0 : highlightedId + 1;
        setHighlighted(highlighted_item);
        break;

      case('ArrowUp'):
        highlighted_item = (highlightedId - 1) < 0 ? (options.length - 1) : highlightedId - 1;
        setHighlighted(highlighted_item);
        break;

      case('Enter'):
        const selectedOption = props.options[highlightedId];
        props.onSelect(selectedOption.id);
        setQuery(selectedOption.text);
        setOpen(false);
        event.target.blur();
        setHighlighted(0);
        break;

      case('Escape'):
        setOpen(false);
        setHighlighted(0);
        event.target.blur();
        break;
      default:
        break;
    }
  };
  let optionList = getList();
  let activeClass = (open && optionList.length > 0) ? ' active' : '';

  return (
    <div className={'auto-wrapper ' + props.className + activeClass + (props.disabled ? ' disabled' : '')}
         onBlur={handleClickOutside}
         onKeyDown={handleKeyDown}>

      <input className="auto-input"
             name={props.name}
             type="text"
             autoComplete="off"
             placeholder={props.placeholder}
             onClick={(e) => handleClick(e)}
             onChange={(e) => onChange(e)}
             value={query}
             ref={inputRef}
      />

      <ul className="auto-menu">
        {optionList}
      </ul>
      {props.showError ? <div className="error-text">{props.errorMessage}</div> : ''}
    </div>
  );
};

export default AutoComplete;
