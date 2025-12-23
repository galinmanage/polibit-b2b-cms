import React, { useImperativeHandle, useState } from 'react';
import './index.scss';
import { ReactComponent as SearchIcon } from 'assets/icons/search.svg';
import { conditionalClassName } from '../../app/functions';

const SearchBox = React.forwardRef((props, ref) => {
  const {
    className = '',
    onSubmit = () => {},
    placeholder = '',
  } = props;
  const [value, setValue] = useState('');

  useImperativeHandle(ref, () => ({
    reset: () => setValue(''),
  }));


  const onSubmitHandler = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  const onChangeHandler = (e) => {
    const { value } = e.target;
    setValue(value);
  };

  return (
    <form
      className={`search-box-wrapper${conditionalClassName(className)}`}
      onSubmit={onSubmitHandler}
    >
      <input
        type="text"
        className="search-box-input"
        placeholder={placeholder}
        value={value}
        onChange={onChangeHandler}
      />
      <button className={'search-box-button'}>
        <SearchIcon className={'search-box-icon'} />
      </button>
    </form>
  );
});

export default SearchBox;
