import React from 'react';
import './index.scss';
import { conditionalClassName } from 'app/functions';
import { ReactComponent as XIcon } from 'assets/icons/close.svg';

const FilterItem = (props) => {
  const {
    className = '',
    removeIcon = false,
    text,
    onClick = () => {},
    phantom = false,
    value,
    filterKey,
    filterValue,
  } = props;
  const isSplittedValue = filterKey && filterValue;

  if (phantom) {
    return <div className={'filter-item-phantom'} />;
  }

  const getFilterText = () => {
    if (isSplittedValue) {
      return (
        <>
          <span className="filter-key">{filterKey}</span>
          &nbsp;
          <span>{filterValue}</span>
        </>
      );
    }

    return text;
  };

  return (
    <button className={`filter-item-wrapper${conditionalClassName(className)}`} value={value} onClick={onClick}
            title={text || ''}>
      <span className={'filter-text'}>{getFilterText()}</span>
      {!removeIcon && <XIcon className={'remove-icon'} />}
    </button>
  );
};

export default FilterItem;
