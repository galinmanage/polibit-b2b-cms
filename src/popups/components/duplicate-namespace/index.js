import { useRef, useState } from 'react';
import SlidePopup from '../../presets/slide-popup';
import useTranslations from '../../../app/hooks/useTranslations';
import { Button, Dropdown } from '../../../components';
import Api from '../../../api/requests';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../../redux/actions';
import FieldError from '../../../components/forms/field-error';
import { toast } from 'react-toastify';
import './index.scss';

export default function DuplicateNamespacePopup({ id, payload }) {
  const sourceNamespace = payload?.sourceNamespace;
  const ref = useRef();
  const translate = useTranslations();
  const dispatch = useDispatch();
  const [duplicateType, setDuplicateType] = useState('existing');
  const [targetNamespace, setTargetNamespace] = useState('');
  const [newNamespaceName, setNewNamespaceName] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const namespaces = useSelector(state => state.translations.namespaces);
  const filteredNamespaces = namespaces.filter(ns => ns.id !== sourceNamespace?.id);

  const getErrorMessage = () => {
    if (!showErrors) return '';

    if (duplicateType === 'existing') {
      if (!targetNamespace) {
        return translate('cms_manageNamespaces_selectNamespace');
      }
    } else {
      if (!newNamespaceName.trim()) {
        return translate('cms_validation_emptyField');
      }
    }

    return '';
  };

  const isFormValid = () => {
    if (duplicateType === 'existing') {
      return targetNamespace !== '';
    } else {
      return !!newNamespaceName.trim();
    }
  };

  const onNewNamespaceNameChange = (e) => {
    setNewNamespaceName(e.target.value);
  };

  const onDuplicateTypeChange = (type) => {
    setDuplicateType(type);
    if (type === 'new') {
      setTargetNamespace('');
    } else {
      setNewNamespaceName('');
    }
  };

  const onTargetNamespaceChange = (name, value) => {
    setTargetNamespace(value);
  };

  const onDuplicateSubmit = () => {
    if (!isFormValid()) {
      setShowErrors(true);
      return;
    }

    const payload = {
      sourceId: sourceNamespace?.id,
    };

    if (duplicateType === 'existing') {
      const selectedNamespace = filteredNamespaces[targetNamespace];
      if (!selectedNamespace) {
        setShowErrors(true);
        return;
      }
      payload.id = selectedNamespace.id;
    } else {
      payload.name = newNamespaceName;
    }

    const props = {
      payload,
      onSuccess: (res) => {
        if (duplicateType === 'new' && res.id) {
          dispatch(Actions.addNamespace({
            id: res.id,
            name: newNamespaceName,
          }));
        }

        const successMessage = duplicateType === 'existing'
          ? translate('cms_manageNamespaces_duplicateToExistingSuccess')
            .replace('{source}', sourceNamespace.name)
            .replace('{target}', filteredNamespaces[targetNamespace].name)
          : translate('cms_manageNamespaces_duplicateToNewSuccess')
            .replace('{source}', sourceNamespace.name)
            .replace('{target}', newNamespaceName);

        toast.success(successMessage);
        ref.current?.animateOut();
      },
      onFailure: (error) => {
        toast.error(error?.message || translate('cms_general_error'));
      },
    };

    Api.duplicateNamespace(props);
  };

  const onCancel = () => {
    ref.current?.animateOut();
  };

  const errorMessage = getErrorMessage();

  return (
    <SlidePopup ref={ref} id={id} className="duplicate-namespace-popup">
      <div className={'duplicate-namespace-wrapper'}>
        <div className="popup-header">
          <h1 className={'duplicate-namespace-headline'}>
            {translate('cms_duplicateNamespacePopup_title')}
          </h1>
        </div>
        <div className={'duplicate-namespace-body-wrapper'}>
          <div className="duplicate-namespace-info">
            {translate('cms_manageNamespaces_duplicateFrom')} <strong>{sourceNamespace?.name}</strong>
          </div>

          <div className="duplicate-type-selection">
            <div
              className={`duplicate-type-option ${duplicateType === 'existing' ? 'selected' : ''}`}
              onClick={() => onDuplicateTypeChange('existing')}
            >
              {translate('cms_manageNamespaces_duplicateToExisting')}
            </div>
            <div
              className={`duplicate-type-option ${duplicateType === 'new' ? 'selected' : ''}`}
              onClick={() => onDuplicateTypeChange('new')}
            >
              {translate('cms_manageNamespaces_duplicateToNew')}
            </div>
          </div>

          {duplicateType === 'existing' ? (
            <div className="duplicate-to-existing">
              <Dropdown
                name={'targetNamespace'}
                className={'namespace-select-wrapper'}
                placeholder={translate('cms_manageNamespaces_selectTargetNamespace')}
                value={targetNamespace}
                onChange={onTargetNamespaceChange}
                options={filteredNamespaces}
                nameKey={'name'}
              />
            </div>
          ) : (
            <div className="duplicate-to-new">
              <input
                className={'texts-input'}
                type={'text'}
                value={newNamespaceName}
                placeholder={translate('cms_manageNamespaces_newNamespaceName')}
                onChange={onNewNamespaceNameChange}
                required={true}
              />
            </div>
          )}

          <FieldError
            errorMessage={errorMessage}
            isThereError={!!errorMessage}
            centeredError={true}
          />

          <div className="duplicate-actions">
            <Button className="cancel-button" onClick={onCancel}>
              {translate('cms_general_cancel')}
            </Button>
            <Button className="duplicate-button" onClick={onDuplicateSubmit}>
              {translate('cms_manageNamespaces_duplicateButton')}
            </Button>
          </div>
        </div>
      </div>
    </SlidePopup>
  );
} 
