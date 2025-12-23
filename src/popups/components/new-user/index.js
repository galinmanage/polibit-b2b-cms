import Api from 'api/requests';
import useDropdownData from 'app/hooks/useDropdownData';
import useTranslations from 'app/hooks/useTranslations';
import { EXCEL_EXPORT_KEY } from 'constants/export-to-excel';
import ROUTES from 'constants/routes';
import SlidePopup from 'popups/presets/slide-popup';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Validate from '../../../app/validation/validation';
import { Dropdown, PermissionChanger } from '../../../components';
import AnimatedInput from '../../../components/forms/animated_input';
import PopupButton from '../add-button';
import './index.scss';

const LEAD_BITWISE_KEYS = {
  TYPE: 'LEAD_BITWISE',
  VIEW: 'VIEW',
  EDIT: 'EDIT',
};

export const ALL_MARKETERS_VALUE = 0;

const NewUserPopup = (props) => {
  const { payload = {} } = props;
  const { isEdit = false, userData = {}, id } = payload;
  const ref = useRef();
  const translate = useTranslations();
  const [form, updateForm] = useState(getInitialFormState);
  const leadsStatusesData = useSelector((store) => store.leadsStatusesData);
  const dropdownData = useDropdownData([leadsStatusesData], true);
  const marketersDropdownOptions = {
    ...dropdownData('marketers'),
    0: translate('cms_lead_page_permissions_all_marketers'),
  };

  // IS USER ALLOWED TO SEE LEADS INFO PAGE
  const isLeadsPageAllowed = Boolean(form.bitwise.value & ROUTES.ROOT.subs.LeadsPage.permissions);
  const subLeadObject = ROUTES.ROOT.subs.LeadsPage.subs.LEAD.subs;

  const [isFirstTry, setIsFirstTry] = useState(true);

  const validationRules = () => {
    return {
      get lead_bitwise() {
        return isLeadsPageAllowed ? ['greater_than_zero'] : ['no_validation'];
      },
      get marketers() {
        return isLeadsPageAllowed ? ['is_not_empty_array'] : ['no_validation'];
      },
    };
  };

  function getInitialFormState() {
    return {
      full_name: {
        value: userData.full_name ? userData.full_name : '',
        rules: ['not_empty', 'full_name'],
        errMsg: '',
        valid: false,
      },
      id: {
        value: userData.id ? userData.id : '',
        rules: ['no_validation'],
        errMsg: '',
        valid: false,
      },
      id_user: {
        value: userData.id_user ? userData.id_user : '',
        rules: ['not_empty', 'id'],
        errMsg: '',
        valid: false,
      },
      phone: {
        value: userData.phone ? userData.phone : '',
        rules: ['phone'],
        errMsg: '',
        valid: false,
      },
      email: {
        value: userData.email ? userData.email : '',
        rules: ['email'],
        errMsg: '',
        valid: false,
      },
      bitwise: {
        value: userData.bitwise ? userData.bitwise : 0,
        rules: ['greater_than_zero'],
        errMsg: '',
        valid: false,
      },
      marketers: {
        value: 'marketers' in userData ? userData.marketers : '',
        rules: isLeadsPageAllowed ? ['is_not_empty_array'] : ['no_validation'],
        errMsg: '',
        valid: false,
      },
      lead_bitwise: {
        value: userData.lead_bitwise ? userData.lead_bitwise : 0,
        rules: isLeadsPageAllowed ? ['greater_than_zero'] : ['no_validation'],
        errMsg: '',
        valid: false,
      },
      is_active: {
        value: userData.is_active ? userData.is_active : 1,
        rules: ['no_validation'],
        errMsg: '',
        valid: false,
      },
    };
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let formIsValid = true;
    const newForm = JSON.parse(JSON.stringify(form));
    for (const field in newForm) {
      const inputValidation = validationRules(newForm)[field];
      const validationObj = Validate(newForm[field].value, inputValidation ?? newForm[field].rules);
      newForm[field].valid = validationObj.valid;
      newForm[field].errMsg = validationObj.msg;
      if (!validationObj.valid) {
        formIsValid = false;
      }
    }
    updateForm(newForm);
    setIsFirstTry(false);

    if (formIsValid) {
      const onSuccess = () => {
        updateForm(getInitialFormState());
        ref.current?.animateOut();
        Api.getUsers({ payload: { [EXCEL_EXPORT_KEY]: 0 } });
      };

      const props = {
        onSuccess,
        payload: {
          full_name: newForm.full_name.value,
          id_user: newForm.id_user.value,
          phone: newForm.phone.value,
          email: newForm.email.value,
          bitwise: newForm.bitwise.value,
          is_active: newForm.is_active.value,
          ...(isLeadsPageAllowed && { lead_bitwise: newForm.lead_bitwise.value, marketer: newForm.marketers.value }),
        },
      };
      if (isEdit) {
        props.payload['id'] = newForm.id.value;
      }

      Api.addUpdateUser(props);
    }
  };

  const onChangeHandler = (e, additionalData = {}) => {
    let { name, value, inputName = '' } = e.target;
    const { type, key } = additionalData;

    const newForm = JSON.parse(JSON.stringify(form));
    const inputValidation = validationRules(newForm)[name];
    const validationObj = Validate(value, inputValidation ?? newForm[name].rules);
    newForm[name].errMsg = validationObj.msg;
    newForm[name].valid = validationObj.valid;

    if (type === LEAD_BITWISE_KEYS.TYPE) {
      const { view: viewBitwise, edit: editBitwise } = subLeadObject[inputName].leadBitwise;

      // * CHECK IF 'EDIT'/'VIEW' BITWISE IS ADDED OR REMOVED
      const isEditBitwiseAdded = !Boolean(newForm[name].value & editBitwise);
      const isViewBitwiseAdded = Boolean(newForm[name].value & viewBitwise);

      if (key === LEAD_BITWISE_KEYS.EDIT && viewBitwise && isEditBitwiseAdded) {
        // * IF 'EDIT' BITWISE IS ADDED => CHECK IF 'VIEW' PERMISSIONS ALREADY EXISTS. IF NOT => ADD THEM
        value = value & viewBitwise ? value : value | viewBitwise;
      } else if (key === LEAD_BITWISE_KEYS.VIEW && editBitwise && isViewBitwiseAdded) {
        // * IF 'VIEW' BITWISE IS REMOVED => CHECK IF 'EDIT' PERMISSIONS EXISTS. IF SO => REMOVE THEM
        value = value & editBitwise ? value & ~editBitwise : value;
      }
    }

    if (name === 'marketers' && value.includes(ALL_MARKETERS_VALUE)) {
      if (value?.length > 1 && value[0] === ALL_MARKETERS_VALUE) {
        value.shift();
      } else if (value[value.length - 1] === ALL_MARKETERS_VALUE) {
        value = [ALL_MARKETERS_VALUE];
      }
    }

    newForm[name].value = value;
    updateForm(newForm);
  };

  const showError = (field) => {
    return !isFirstTry && !form[field].valid;
  };

  const leadPermissionsObject = {
    name: 'lead_bitwise',
    className: 'new-user-permissions-wrapper leads-bitwise',
    userPermissions: form.lead_bitwise.value,
    showError: showError('lead_bitwise'),
    errorMessage: form.lead_bitwise.errMsg,
    options: subLeadObject,
  };

  return (
    <SlidePopup ref={ref} id={id}>
      <div className="new-user-popup-wrapper">
        <div className="popup-header">
          <h1 className={'new-user-headline'}>{translate(`cms_addUserPopup_headLine_${isEdit ? 'edit' : 'add'}`)}</h1>
        </div>
        <form className="new-user-form" onSubmit={onSubmitHandler}>
          <AnimatedInput
            name={'full_name'}
            placeholder={translate('cms_userspage_column_fullname')}
            className={'new-user-input-field'}
            value={form.full_name.value}
            onChange={onChangeHandler}
            showError={showError('full_name')}
            errorMessage={form.full_name.errMsg}
          />
          <AnimatedInput
            name={'id_user'}
            placeholder={translate('cms_usersPage_column_id')}
            className={'new-user-input-field'}
            value={form.id_user.value}
            onChange={onChangeHandler}
            showError={showError('id_user')}
            errorMessage={form.id_user.errMsg}
          />
          <AnimatedInput
            name={'phone'}
            placeholder={translate('cms_usersPage_column_phone')}
            className={'new-user-input-field'}
            value={form.phone.value}
            onChange={onChangeHandler}
            showError={showError('phone')}
            errorMessage={form.phone.errMsg}
          />
          <AnimatedInput
            name={'email'}
            placeholder={translate('cms_userspage_column_email')}
            className={'new-user-input-field'}
            value={form.email.value}
            onChange={onChangeHandler}
            showError={showError('email')}
            errorMessage={form.email.errMsg}
          />
          <div className={'new-users-permissions-wrapper'}>
            <h4 className={'new-users-permissions-headline'}>{translate('cms_usersPage_column_permissions')}</h4>
            <PermissionChanger
              name={'bitwise'}
              className={'new-user-permissions-wrapper'}
              userPermissions={form.bitwise.value}
              onChange={onChangeHandler}
              showError={showError('bitwise')}
              errorMessage={form.bitwise.errMsg}
            />
          </div>

          {isLeadsPageAllowed && (
            <>
              <div className="marketer-dropdown-wrapper">
                <h4
                  className={'new-users-permissions-headline'}>{translate('cms_lead_page_permissions_marketers_header')}</h4>
                <Dropdown
                  value={form.marketers.value}
                  name={'marketers'}
                  options={marketersDropdownOptions}
                  onChange={(name, value) => onChangeHandler({ target: { name, value } })}
                  className={'dropdown'}
                  placeholder={translate('cms_blockedpage_marketers')}
                  showError={showError('marketers')}
                  errorMessage={form.marketers.errMsg}
                  multiple
                />
              </div>

              <div className="leads-permissions-wrapper">
                <div className={'new-users-permissions-wrapper lead-tabs'}>
                  <h4
                    className={'new-users-permissions-headline'}>{translate('cms_lead_page_tabs_view_permissions')}</h4>
                  <PermissionChanger
                    {...leadPermissionsObject}
                    onChange={(e) => onChangeHandler(e, { type: LEAD_BITWISE_KEYS.TYPE, key: LEAD_BITWISE_KEYS.VIEW })}
                    leadBitwiseKey={'view'}
                  />
                </div>

                <div className={'new-users-permissions-wrapper lead-tabs'}>
                  <h4
                    className={'new-users-permissions-headline'}>{translate('cms_lead_page_tabs_edit_permissions')}</h4>
                  <PermissionChanger
                    {...leadPermissionsObject}
                    onChange={(e) => onChangeHandler(e, { type: LEAD_BITWISE_KEYS.TYPE, key: LEAD_BITWISE_KEYS.EDIT })}
                    leadBitwiseKey={'edit'}
                  />
                </div>
              </div>
            </>
          )}

          <PopupButton>{translate(`cms_addUserPopup_button_${isEdit ? 'edit' : 'add'}`)}</PopupButton>
        </form>
      </div>
    </SlidePopup>
  );
};

export default NewUserPopup;
