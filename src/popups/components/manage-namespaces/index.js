import { useRef, useState } from 'react';
import SlidePopup from '../../presets/slide-popup';
import './index.scss';
import useTranslations from '../../../app/hooks/useTranslations';
import { ActionButton, Button } from '../../../components';
import Api from '../../../api/requests';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../../redux/actions';
import TrashIcon from 'assets/icons/trash.svg';
import DuplicateIcon from 'assets/icons/duplicate.svg';
import popupTypes from '../../../constants/popup-types';
import Validate from '../../../app/validation/validation';
import FieldError from '../../../components/forms/field-error';
import { toast } from 'react-toastify';

export default function ManageNamespacesPopup({ id }) {
  const ref = useRef();
  const translate = useTranslations();
  const dispatch = useDispatch();
  const [namespace, setNamespace] = useState('');
  const [isThereError, setIsThereError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const namespaces = useSelector(state => state.translations.namespaces);
  const translations = useSelector(state => state.translations.texts);

  const onAddNamespace = () => {
    let isFormValid = true;
    const validationObj = Validate(namespace, ['not_empty']);
    setErrorMessage(validationObj.msg);
    isFormValid = validationObj.valid;
    if (!isFormValid) {
      setIsThereError(true);
      return;
    }
    const props = {
      payload: {
        name: namespace,
      },
      onSuccess: (res) => {
        dispatch(Actions.addNamespace({
          id: res.id,
          name: namespace,
        }));
        toast.success(translate('cms_manageNamespaces_addSuccess').replace('{namespace}', namespace));
        setNamespace('');
        ref.current?.animateOut();
      },
    };
    Api.addNamespace(props);
  };

  const onNamespaceChange = (e) => {
    setNamespace(e.target.value);
    setIsThereError(false);
  };

  const onDuplicateClick = (namespace) => {
    dispatch(Actions.addPopup({
      type: popupTypes.DUPLICATE_NAMESPACE,
      payload: {
        sourceNamespace: namespace,
      },
    }));
  };

  const onDeleteClick = (namespace) => {
    const { id, name } = namespace;
    const relatedTranslations = translations.filter(text => text.namespaceId === id);
    const onConfirmClick = () => {
      const props = {
        payload: {
          id,
        },
        onSuccess: (res) => {
          dispatch(Actions.removeNamespace(id));
          dispatch(Actions.removeTextsByNamespace(id));
          toast.success(
            translate('cms_manageNamespaces_removeSuccess')
              .replace('{namespace}', name)
              .replace('{translations}', relatedTranslations.length ?? 0),
          );
        },
      };
      Api.removeNamespace(props);
    };
    dispatch(Actions.addPopup({
      type: popupTypes.CONFIRM_ACTION,
      payload: {
        text: translate('cms_manageNamespaces_removeWarning')
          .replace('{namespace}', name)
          .replace('{relatedTranslations}', relatedTranslations.length),
        onConfirmClick,
      },
    }));
  };

  return (
    <SlidePopup ref={ref} id={id} className="manage-namespace-popup">
      <div className={'add-namespace-wrapper'}>
        <div className="popup-header">
          <h1 className={'add-namespace-headline'}>
            {translate('cms_addNamespacePopup_title')}
          </h1>
        </div>
        <div className={'add-namespace-body-wrapper'}>
          {namespaces.map((namespace, index) => (
            <div className={'namespace-wrapper'} key={`namespace-${index}-${namespace.name}-${namespace.id}`}>
              <div className={'namespace-name'}>{namespace.name}</div>
              <div className="namespace-actions">
                {process.env.REACT_APP_ENV === 'stage' && (
                  <ActionButton
                    text={translate('cms_addNamespacePopup_entryDuplicate')}
                    icon={DuplicateIcon}
                    onClick={() => onDuplicateClick(namespace)}
                  />
                )}
                <ActionButton
                  text={translate('cms_addNamespacePopup_entryRemove')}
                  icon={TrashIcon}
                  onClick={() => onDeleteClick(namespace)}
                />
              </div>
            </div>
          ))}
          <input
            className={'texts-input'}
            type={'text'}
            value={namespace}
            placeholder={translate('cms_addNamespacePopup_namespacePlaceholder')}
            name={'key'}
            onChange={onNamespaceChange}
            required={true}
          />
          <FieldError
            errorMessage={errorMessage}
            isThereError={isThereError}
            centeredError={true}
          />
          <Button className="add-namespace-button" onClick={onAddNamespace}>
            {translate('cms_addNamespacePopup_addButton')}
          </Button>
        </div>
      </div>
    </SlidePopup>
  );
}
