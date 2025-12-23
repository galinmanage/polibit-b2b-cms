import useTranslations from 'app/hooks/useTranslations';
import SlidePopup from 'popups/presets/slide-popup';
import { useRef } from 'react';
import PopupButton from '../add-button';
import './index.scss';

const GeneralMessagePopup = (props) => {
  const {
    payload: { content, header = '', showButton = true, additionalClassName = '' },
    id = false,
  } = props;

  const ref = useRef();
  const translate = useTranslations();
  const wrapperClassName = `general-message-popup-wrapper ${additionalClassName}`.trim();

  const handleAnimateOut = () => {
    ref.current?.animateOut();
  };

  return (
    <SlidePopup ref={ref} id={id}>
      <div className={wrapperClassName}>
        <div className="popup-header">
          <h1 className={'general-message-headline'}>{header}</h1>
        </div>

        <div className="general-message-wrapper">
          <div className="general-message-content">{content}</div>

          {showButton && (
            <PopupButton onClick={handleAnimateOut} className={'general-message-close-button'}>
              {translate('cms_general_message_popup_close')}
            </PopupButton>
          )}
        </div>
      </div>
    </SlidePopup>
  );
};

export default GeneralMessagePopup;
