import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../redux/actions';
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock';

//popup types
import popupTypes from 'constants/popup-types';

//popup components
import BasicPopup from './components/basic';
import TwoActionPopup from './components/two-action';

import './index.scss';
import NewUserPopup from './components/new-user';
import NewFieldPopup from './components/new-field';
import ApproveConditionsPopup from './components/approve-conditions';
import GeneralMessagePopup from './components/general-message';
import ConfirmActionPopup from './components/confirm-action';
import ManageNamespacesPopup from './components/manage-namespaces';
import DuplicateNamespacePopup from './components/duplicate-namespace';

export default function Popups() {
  const popupsArray = useSelector((store) => store.popupsArray);
  const dispatch = useDispatch();

  //stop body from scrolling while popup is open
  useEffect(() => {
    let popupContainer = document.querySelector('#popupContainer');
    disableBodyScroll(popupContainer);

    return () => {
      clearAllBodyScrollLocks();
    };
  }, []);

  //map popup types to popup components
  const getPopupComponent = (key, type, payload) => {
    const popupProps = {
      payload,
      id: key,
    };

    const popupComponents = {
      [popupTypes.GENERAL_MESSAGE]: (
        <GeneralMessagePopup key={key} {...popupProps} />
      ),
      [popupTypes.API_MESSAGE]: <BasicPopup key={key} {...popupProps} />,
      [popupTypes.API_ERROR]: <BasicPopup key={key} {...popupProps} />,
      [popupTypes.TWO_ACTION]: <TwoActionPopup key={key} {...popupProps} />,
      [popupTypes.NEW_USER]: <NewUserPopup key={key} {...popupProps} />,
      [popupTypes.NEW_FIELD]: <NewFieldPopup key={key} {...popupProps} />,
      [popupTypes.APPROVE_CONDITIONS]: (
        <ApproveConditionsPopup key={key} {...popupProps} />
      ),
      [popupTypes.CONFIRM_ACTION]: (
        <ConfirmActionPopup key={key} {...popupProps} />
      ),
      [popupTypes.MANAGE_NAMESPACES]: (
        <ManageNamespacesPopup key={key} {...popupProps} />
      ),
      [popupTypes.DUPLICATE_NAMESPACE]: (
        <DuplicateNamespacePopup key={key} {...popupProps} />
      ),
    };

    return (
      popupComponents[type] ?? (
        <BasicPopup key={key} payload={{ text: 'unknown popup type' }} />
      )
    );
  };

  const renderPopups = () => {
    const popupsToRender = popupsArray.map((popup) => {
      const { key } = popup;
      return getPopupComponent(key, popup.type, popup.payload);
    });
    return popupsToRender;
  };

  //close the popup when back button is pressed instead of going to previous page
  const closePopupOnBackButton = () => {
    dispatch(Actions.removePopup());
    return false;
  };

  return (
    <div className="popup" id="popupContainer">
      {/*<Prompt*/}
      {/*    when    = { true }*/}
      {/*    message = { closePopupOnBackButton }*/}
      {/*/>*/}
      {renderPopups()}
    </div>
  );
}
