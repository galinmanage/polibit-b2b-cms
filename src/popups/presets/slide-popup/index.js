import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import Actions from '../../../redux/actions';

import './index.scss';
import XIcon from 'assets/icons/close.svg';

const SlidePopupRef = (props, ref) => {
  const {
    id = undefined,
    showCloseIcon = false,
    children,
    className = '',
    header = false,
    animateOutCallback = () => {},
  } = props;

  const [animationClass, setAminationClass] = useState('');
  const dispatch = useDispatch();
  const modalRef = useRef();
  const initialY = useRef();

  useImperativeHandle(ref, () => ({
    animateOut,
  }));

  const animateIn = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAminationClass('active');
      });
    });
  };
  useEffect(() => {
    animateIn();
  }, []);

  const completeAnimation = () => {
    if (animationClass !== 'exit' && animationClass !== 'done') {
      setAminationClass('done');
    }
  };
  const animateOut = (callback) => {
    setAminationClass('exit');
    setTimeout(() => {
      if (callback) {
        callback();
      }

      dispatch(Actions.removePopup(id));
    }, 200);
  };

  function handleOnTouchStart(e) {
    // Get TouchEvent ClientY

    const clientY = Math.round(e.changedTouches[0].clientY);
    initialY.current = clientY;
  }

  function handleOnTouchRelease(e) {
    const clientY = e.changedTouches[0].clientY;

    if (window.innerHeight - window.innerHeight / 5 <= clientY) {
      animateOut();
    } else {
      modalRef.current.style.top = `0px`;
    }
  }

  function onTouchMove(e) {
    const clientY = e.changedTouches[0].clientY;
    if (clientY > initialY.current) {
      modalRef.current.style.top = `${Math.abs(initialY.current - clientY)}px`;
    }
  }

  return (
    <div
      className={`backdrop slidePopup ${className} ${animationClass} `}
      onClick={() => animateOut(animateOutCallback)}
      onTransitionEnd={completeAnimation}
    >
      {typeof header === 'function' && header()}
      <div
        className={'popup_wrapper ' + animationClass}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        {showCloseIcon && (
          <div
            className="close-icon-wrapper"
            onClick={() => animateOut(animateOutCallback)}
          >
            <img src={XIcon}></img>
          </div>
        )}
        <div
          className="gesture-handler"
          onTouchMove={(e) => onTouchMove(e)}
          onTouchEnd={(e) => handleOnTouchRelease(e)}
          onTouchStart={(e) => handleOnTouchStart(e)}
        />
        <div className="popup_content ">{children}</div>
      </div>
    </div>
  );
};
const SlidePopup = forwardRef(SlidePopupRef);

export default SlidePopup;
