import React from 'react';
import './index.scss';
import ROUTES from '../../constants/routes';
import useTranslations from '../../app/hooks/useTranslations';
import { Checkbox } from '../index';
import checkboxTypes from '../../constants/checkboxTypes';
import { conditionalClassName } from '../../app/functions';

const PermissionChanger = (props) => {
  const {
    name,
    userPermissions = 0,
    onChange = () => {},
    disabled = false,
    className = '',
    showError = false,
    errorMessage = '',
    options = false,
    leadBitwiseKey = false,
    isBoxCheckboxStyle = false,
  } = props;
  const translate = useTranslations();
  const items = leadBitwiseKey ? formatLeadsBitwise() : options || ROUTES.ROOT.subs;
  const onChangeHandler = (e) => {
    const { checked, value, name: inputName } = e.target;
    let calculatedPermissions = userPermissions;
    if (checked) {
      calculatedPermissions += parseInt(value);
    } else {
      calculatedPermissions -= parseInt(value);
    }

    const syntheticEvent = {
      target: {
        name: name,
        inputName: inputName,
        value: calculatedPermissions,
      },
    };

    onChange(syntheticEvent);
  };

  function formatLeadsBitwise() {
    const optionsObj = {};

    for (const optionItem in options) {
      const itemText = options[optionItem]?.text;
      const itemValue = options[optionItem]?.leadBitwise[leadBitwiseKey];

      if (itemValue) {
        optionsObj[optionItem] = { permissions: itemValue, text: itemText };
      }
    }

    return optionsObj;
  }

  return (
    <div className={`permission-changer-wrapper${conditionalClassName(className)}`}>
      {Object.keys(items).map((key, idx) => {
        if (items[key].permissions === 0) {
          return <React.Fragment key={`no-permissions-${key}-${idx}`} />;
        }
        const permissionsCalc = items[key].permissions & userPermissions;
        const isChecked = permissionsCalc === items[key].permissions;
        return (
          <div className={'user-permission-wrapper'} key={`user-permissions-${key}-${idx}`}>
            <Checkbox
              className={'permission-checkbox'}
              type={'checkbox'}
              name={key}
              checked={isChecked}
              value={items[key].permissions}
              onChange={onChangeHandler}
              disabled={disabled}
              style={isBoxCheckboxStyle ? checkboxTypes.BOX : checkboxTypes.CHECK_MARK}
              label={translate(items[key].text)}
              labelClassName={'user-permission-label'}
            />
          </div>
        );
      })}

      {showError ? <div className={'error-text'}>{errorMessage}</div> : <></>}
    </div>
  );
};

export default PermissionChanger;
