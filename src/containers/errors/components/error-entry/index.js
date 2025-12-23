import useTranslations from 'app/hooks/useTranslations';
import CheckMark from 'assets/icons/check.svg';
import XIcon from 'assets/icons/close.svg';
import EditIcon from 'assets/icons/edit.svg';
import TrashIcon from 'assets/icons/trash.svg';
import { ActionButton } from 'components';
import { EXCEL_EXPORT_KEY } from 'constants/export-to-excel';
import popupTypes from 'constants/popup-types';
import { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import Api from '../../../../api/requests';
import Validate from '../../../../app/validation/validation';
import { Checkbox } from '../../../../components';
import upsertModuleTypes from '../../../../constants/upsertModuleTypes';
import Actions from '../../../../redux/actions';

const ErrorEntry = memo((props) => {
  const translate = useTranslations();
  const dispatch = useDispatch();
  const {
    id,
    value,
    showOnGd = false,
    paramID,
  } = props;
  const [editable, setEditable] = useState(false);
  const [form, updateForm] = useState(getInitialForm());

  function getInitialForm() {
    return {
      key: {
        value: id,
        valid: false,
        errMsg: '',
        rules: ['not_empty'],
      },
      value: {
        value: value,
        errMsg: '',
        valid: false,
        rules: ['not_empty'],
      },
      showOnGd: {
        value: showOnGd,
        errMsg: '',
        valid: false,
        rules: ['no_validation'],
      },
    };
  }

  const onChangeForm = (e) => {
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
    updateForm(newForm);
    if (isFormValid) {
      const props = {
        payload: {
          module: upsertModuleTypes.ERROR,
          id: parseInt(paramID),
          key: newForm.key.value,
          value: newForm.value.value,
          gd: newForm.showOnGd.value ? 1 : 0,
        },
        onSuccess: () => {
          setEditable(false);
          const props = { payload: { [EXCEL_EXPORT_KEY]: 0 } };
          Api.getErrors(props).then((res) => {
            dispatch(Actions.setErrors(res.data.error_lang_param));
          });
        },
      };

      Api.upsertErrorsLangParam(props);
    }
  };

  const onEditCancel = () => {
    setEditable(false);
    updateForm(getInitialForm());
  };

  const getEditableButtons = () => {
    return (
      <>
        <ActionButton
          text={translate('cms_errorsPage_entry_save')}
          icon={CheckMark}
          onClick={onSaveEdit}
        />
        <ActionButton
          text={translate('cms_errorsPage_entry_cancel')}
          icon={XIcon}
          onClick={onEditCancel}
        />
      </>
    );
  };

  const onEditClick = () => {
    setEditable(true);
  };

  const onDeleteClick = () => {
    const handleErrorDelete = () => {
      const onDeleteSuccess = () => {
        Api.getErrors({
          payload: { [EXCEL_EXPORT_KEY]: 0 },
          onSuccess: (res) => dispatch(Actions.setErrors(res.data.error_lang_param)),
        });
      };

      const props = { payload: { id: parseInt(paramID) }, onSuccess: onDeleteSuccess };
      Api.deleteError(props);
    };

    const popupTextTranslation = translate('delete_error_are_you_sure');
    const popupText = Array.isArray(popupTextTranslation) ? popupTextTranslation[0] : popupTextTranslation;
    const formattedPopupText = popupText.replace('{key}', id);
    dispatch(Actions.addPopup({
      type: popupTypes.CONFIRM_ACTION,
      payload: { text: formattedPopupText, onConfirmClick: handleErrorDelete },
    }));
  };

  const getDisabledButtons = () => {
    return (
      <>
        <ActionButton
          text={translate('cms_errorsPage_entry_edit')}
          icon={EditIcon}
          onClick={onEditClick}
        />
        <ActionButton
          text={translate('cms_errorsPage_entry_remove')}
          icon={TrashIcon}
          onClick={onDeleteClick}
        />
      </>
    );
  };

  return (
    <tr className={`table-row`}>
      <td className={'table-cell error-table-key'}>
        {form.key.value}
      </td>
      <td className={'table-cell'}>
                <textarea
                  name={'value'}
                  className={'errors-value'}
                  value={form.value.value}
                  onChange={onChangeForm}
                  disabled={!editable}
                />
      </td>
      <td className={'table-cell center'}>
        <Checkbox
          name={'showOnGd'}
          checked={form.showOnGd.value}
          disabled={!editable}
          onChange={onChangeForm}
        />
      </td>
      <td className={'table-cell'}>
        {editable ? getEditableButtons() : getDisabledButtons()}
      </td>
    </tr>
  );
});

export default ErrorEntry;
