import { ActionButton } from 'components';
import { memo, useState } from 'react';

import Api from 'api/requests';
import useTranslations from 'app/hooks/useTranslations';
import CheckMark from 'assets/icons/check.svg';
import XIcon from 'assets/icons/close.svg';
import EditIcon from 'assets/icons/edit.svg';
import TrashIcon from 'assets/icons/trash.svg';
import popupTypes from 'constants/popup-types';
import { useDispatch } from 'react-redux';
import Validate from '../../../../app/validation/validation';
import Actions from '../../../../redux/actions';
import { toast } from 'react-toastify';

const TextEntry = memo((props) => {
  const {
    id, value, namespace, paramID,
  } = props;
  const translate = useTranslations();
  const dispatch = useDispatch();
  const [editable, setEditable] = useState(false);
  const [form, updateForm] = useState(getInitialForm());
  const [isFirstTry, setIsFirstTry] = useState(true);

  function getInitialForm() {
    return {
      key: {
        value: id, valid: false, errMsg: '', rules: ['not_empty'],
      }, value: {
        value: value, errMsg: '', valid: false, rules: ['not_empty'],
      },
    };
  }

  const onEditClick = () => {
    setEditable(true);
  };

  const onChangeHandler = (e) => {
    let { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      value = checked;
    }
    const newForm = JSON.parse(JSON.stringify(form));
    const validationObj = Validate(value, newForm[name].rules);
    newForm[name].valid = validationObj.valid;
    newForm[name].errMsg = validationObj.msg;
    newForm[name].value = value;
    updateForm(newForm);
  };

  const onSaveEdit = () => {
    let isFormValid = true;
    const newForm = JSON.parse(JSON.stringify(form));
    for (const field in newForm) {
      const validationObj = Validate(newForm[field].value, newForm[field].rules);
      newForm[field].valid = validationObj.valid;
      newForm[field].errMsg = validationObj.msg;
      if (!validationObj.valid) {
        isFormValid = false;
      }
    }
    setIsFirstTry(false);
    updateForm(newForm);
    if (isFormValid) {
      const props = {
        payload: {
          id: parseInt(paramID), value: newForm.value.value,
        },
        onSuccess: () => {
          setEditable(false);
          dispatch(
            Actions.updateText({
              id: parseInt(paramID),
              value: newForm.value.value,
            }),
          );
          toast.success(translate('cms_textsPage_editSuccess').replace('{key}', id));
        },
      };

      Api.updateTranslate(props);
    }
  };

  const onEditCancel = () => {
    setEditable(false);
    updateForm(getInitialForm());
  };

  const getEditableButtons = () => {
    return (<>
      <ActionButton
        text={translate('cms_textsPage_entry_save')}
        icon={CheckMark}
        onClick={onSaveEdit}
      />
      <ActionButton
        text={translate('cms_textsPage_entry_cancel')}
        icon={XIcon}
        onClick={onEditCancel}
      />
    </>);
  };

  const onDeleteClick = () => {
    const handleTranslationDelete = () => {
      const onDeleteSuccess = () => {
        dispatch(Actions.removeText(paramID));
        toast.success(translate('cms_textsPage_removeSuccess').replace('{key}', id));
      };

      const props = { payload: { id: parseInt(paramID) }, onSuccess: onDeleteSuccess };
      Api.deleteTranslation(props);
    };

    const popupTextTranslation = translate('delete_translation_are_you_sure');
    const popupText = Array.isArray(popupTextTranslation) ? popupTextTranslation[0] : popupTextTranslation;
    const formattedPopupText = popupText.replace('{key}', id);
    dispatch(Actions.addPopup({
      type: popupTypes.CONFIRM_ACTION, payload: { text: formattedPopupText, onConfirmClick: handleTranslationDelete },
    }));
  };

  const getDisabledButtons = () => {
    return (<>
      <ActionButton
        text={translate('cms_textsPage_entry_edit')}
        icon={EditIcon}
        onClick={onEditClick}
      />
      <ActionButton
        text={translate('cms_textsPage_entry_remove')}
        icon={TrashIcon}
        onClick={onDeleteClick}
      />
    </>);
  };

  return (<tr className={`table-row`}>
    <td className={'table-cell text-table-name'}>{id}</td>
    <td className={'table-cell center'}>
      {namespace}
    </td>
    <td className={'table-cell center'}>
                <textarea
                  name={'value'}
                  className={'texts-value'}
                  value={form.value.value}
                  onChange={onChangeHandler}
                  disabled={!editable}
                />
    </td>
    <td className={'table-cell'}>
      {editable ? getEditableButtons() : getDisabledButtons()}
    </td>
  </tr>);
});

export default TextEntry;
