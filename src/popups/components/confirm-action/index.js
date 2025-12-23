import useTranslations from 'app/hooks/useTranslations';
import SlidePopup from 'popups/presets/slide-popup';
import { useRef } from 'react';
import PopupButton from '../add-button';
import './index.scss';

const ConfirmActionPopup = (props) => {
  const {
    payload: { text = '', onConfirmClick = () => {} },
    id = false,
  } = props;

  const ref = useRef();
  const translate = useTranslations();

  const handleAnimateOut = () => {
    ref.current?.animateOut();
  };

  const handleConfirmClick = () => {
    onConfirmClick();
    handleAnimateOut();
  };

  return (
    <SlidePopup ref={ref} id={id}>
      <div className="confirm-action-popup-wrapper">
        <div className="popup-header">
          <h1 className={'confirm-action-headline'}>{translate('confirm_action_popup_header')}</h1>
        </div>

        <div className="confirm-action-wrapper">
          <div className="popup-text">{text}</div>

          <div className="buttons-wrapper">
            <PopupButton onClick={handleConfirmClick} className={'confirm-button'}>
              {translate('confirm_action_popup_confirm_button')}
            </PopupButton>

            <PopupButton onClick={handleAnimateOut} className={'cancel-button'}>
              {translate('confirm_action_popup_cancel_button')}
            </PopupButton>
          </div>
        </div>
      </div>
    </SlidePopup>
  );
};

export default ConfirmActionPopup;
