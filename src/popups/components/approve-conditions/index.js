import Api from 'api/requests';
import useTranslations from 'app/hooks/useTranslations';
import DownloadImage from 'assets/icons/download.svg';
import popupTypes from 'constants/popup-types';
import SlidePopup from 'popups/presets/slide-popup';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import Actions from '../../../redux/actions';
import PopupButton from '../add-button';
import './index.scss';

const ApproveConditionsPopup = (props) => {
  const {
    payload: { pdfPath, leadId, popupHeader = false, deleteFileCallback = false },
    id = false,
  } = props;

  const dispatch = useDispatch();
  const ref = useRef();
  const translate = useTranslations();

  const handleAnimateOut = (callback = () => {}) => {
    ref.current?.animateOut(callback);
  };

  const handleDeleteFileClick = () => {
    const onSuccess = (res) => {
      if (parseInt(res.status) === 1) {
        handleAnimateOut(deleteFileCallback);
      }
    };

    const onFailure = (err) => {
      if (parseInt(err.status) === 0) {
        const popupPayload = { type: popupTypes.API_ERROR, payload: { text: err?.err?.message } };
        dispatch(Actions.addPopup(popupPayload));
      }
    };

    const apiPayload = { lead_id: leadId };
    const props = { onSuccess, onFailure, payload: apiPayload };
    Api.deleteFileOccupation(props);
  };

  return (
    <SlidePopup ref={ref} id={id}>
      <div className="approve-conditions-popup-wrapper">
        {popupHeader ? (
          <div className="popup-header">
            <h1 className={'approve-conditions-headline'}>{translate(popupHeader)}</h1>
          </div>
        ) : (
          <></>
        )}

        <div className="approve-conditions-data-wrapper">
          <div className="approve-conditions-wrapper">
            <object type="application/pdf" data={`${pdfPath}#toolbar=0`} className={'approve-conditions-pdf-file'}
                    frameBorder="0" scrolling="auto"></object>
          </div>

          <div className="approve-conditions-buttons-wrapper">
            <a href={pdfPath} className={'approve-conditions-button approve-conditions-download'} target="_blank"
               download>
              <PopupButton className={'approve-conditions-button'}>
                <span>{translate('cms_approve_conditions_popup_download')}</span>
                <div className={'approve-conditions-button-icon'}>
                  <img src={DownloadImage} alt={translate('cms_approve_conditions_popup_download')} />
                </div>
              </PopupButton>
            </a>

            {deleteFileCallback ? (
              <PopupButton onClick={handleDeleteFileClick} className={'approve-conditions-button delete-button'}>
                {translate('cms_uploaded_file_delete_button')}
              </PopupButton>
            ) : null}

            <PopupButton onClick={handleAnimateOut} className={'approve-conditions-button'}>
              {translate('cms_approve_conditions_popup_close')}
            </PopupButton>
          </div>
        </div>
      </div>
    </SlidePopup>
  );
};

export default ApproveConditionsPopup;
