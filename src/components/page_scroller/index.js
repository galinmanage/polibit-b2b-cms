import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Actions from '../../redux/actions';

export default function PageScroller(props) {
  const {
    options = {
      root: null,
      rootMargin: props.rootMargin || '60px',
      threshold: 0,
    },
    callback = null,
    className = '',
  } = props;

  const ref = useRef();
  const observerRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!ref.current) return;

    observerRef.current = new IntersectionObserver((entries, observer) => {
      entries[0].isIntersecting ?
        dispatch(Actions.setPageScroller(false)) :
        dispatch(Actions.setPageScroller(true));

      if (callback) onIntersection(entries, observer);
    }, options);

    observerRef.current.observe(ref.current);

    return () => {
      if (observerRef.current && ref.current) {
        observerRef.current.unobserve(ref.current);
        observerRef.current.disconnect();
      }
    };
  }, [ref.current]);

  const onIntersection = (entries, observer) => {
    callback(entries, observer);
  };

  return (
    <div className={`page-scroller ${className}`} ref={ref}>
    </div>
  );
}
