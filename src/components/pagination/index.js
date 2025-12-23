import React from 'react';
import './index.scss';
import { conditionalClassName } from '../../app/functions';
import usePagination from '../../app/hooks/usePagination';

const Pagination = (props) => {
  const {
    currentPage,
    totalCount = 300,
    onChange = () => {},
    siblingCount = 2,
    className = '',
    pageClassName = '',
  } = props;

  const pages = usePagination({
    totalCount: totalCount,
    currentPage: currentPage,
    siblingCount: siblingCount,
    pageSize: 5,
  });

  const getStyles = (index) => {
    const distance = Math.abs(currentPage - index);
    switch (distance) {
      case 0:
        return 'current';
      case 1:
        return 'sibling';
      case 2:
        return 'far-sibling';
      default:
        return '';
    }
  };

  return (
    <div className={`pagination-wrapper${conditionalClassName(className)}`}>
      {pages.map((page, idx) => {
        const className = getStyles(page);
        return page === 'DOTS' ? (
          <Dots
            className={pageClassName}
            key={`pagination-dots-${idx}`}
          />
        ) : (
          <PageNumber
            className={pageClassName + conditionalClassName(className)}
            key={`pagination-page-${page}`}
            page={page}
            onClick={onChange}
          />
        );
      })}
    </div>
  );
};

export default Pagination;

const PageNumber = (props) => {
  const { page, onClick = () => {}, className = '' } = props;

  const onClickHandler = () => {
    typeof onClick === 'function' && onClick(page);
  };

  return (
    <button
      className={`page-number${conditionalClassName(className)}`}
      onClick={onClickHandler}
    >
      {page}
    </button>
  );
};

const Dots = (props) => {
  const { className = '' } = props;
  return <div className={`dots${conditionalClassName(className)}`}>...</div>;
};
