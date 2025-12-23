import { conditionalClassName } from 'app/functions';
import useTranslations from 'app/hooks/useTranslations';
import PlusIcon from 'assets/icons/add.svg';
import { ActionButton, Checkbox, FilterItem, SearchBox } from 'components';
import ExcelButton from 'components/excel-button';
import { EXCEL_EXPORT_KEY } from 'constants/export-to-excel';
import regex from 'constants/regex';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../../api/requests';
import Validate from '../../app/validation/validation';
import upsertModuleTypes from '../../constants/upsertModuleTypes';
import Actions from '../../redux/actions';
import ErrorEntry from './components/error-entry';
import './index.scss';

const ErrorsPage = (props) => {
  const searchRef = useRef();
  const translate = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const errorsData = useSelector(store => store.errorsData);
  const dispatch = useDispatch();

  const [form, updateForm] = useState(getInitialFormState());

  useEffect(() => {
    const onSuccess = (res) => {
      dispatch(Actions.setErrors(res.data.error_lang_param));
    };
    const props = {
      onSuccess,
      payload: { [EXCEL_EXPORT_KEY]: 0 },
    };
    Api.getErrors(props);
  }, []);

  const onChangeForm = (e) => {
    let { name, value, type, checked } = e.target;
    if (name === 'key' && value.charAt(value.length - 1) === ' ') {
      if (value.length > 2 && value.charAt(value.length - 2) === '_') {
        return;
      }
      value = value.slice(0, value.length - 1) + '_';
    }
    if (type === 'checkbox') {
      value = checked;
    }
    if (name === 'value') {
      value = value.replaceAll(regex.BOLD_TEXT, regex.TEMPLATE_BOLD_HTML);
    }
    const newForm = JSON.parse(JSON.stringify(form));
    const validationObj = Validate(value, newForm[name].rules);
    newForm[name].errMsg = validationObj.msg;
    newForm[name].valid = validationObj.valid;
    newForm[name].value = value;
    updateForm(newForm);
  };

  const onAddHandler = () => {
    let formIsValid = true;
    const newForm = JSON.parse(JSON.stringify(form));
    for (const field in newForm) {
      const validationObj = Validate(newForm[field].value, newForm[field].rules);
      newForm[field].valid = validationObj.valid;
      newForm[field].errMsg = validationObj.msg;
      if (!validationObj.valid) {
        formIsValid = false;
      }
    }
    updateForm(newForm);
    if (formIsValid) {
      const onSuccess = () => {
        updateForm(getInitialFormState());
      };
      const props = {
        onSuccess,
        payload: {
          'module': upsertModuleTypes.ERROR,
          gd: newForm.showOnGd.value ? 1 : 0,
          key: newForm.key.value,
          value: newForm.value.value,
        },
      };
      Api.upsertErrorsLangParam(props).then(res => {
        const props = { payload: { [EXCEL_EXPORT_KEY]: 0 } };
        Api.getErrors(props).then(res => {
          dispatch(Actions.setErrors(res.data.error_lang_param));
        });
      });
    }
  };

  const onSearchSubmit = (value) => {
    setSearchQuery(value);
  };

  const getFilters = () => {
    if (searchQuery) {
      const resetQuery = () => {
        setSearchQuery('');
        searchRef.current?.reset();
      };
      return (<FilterItem
          key={`errors-page-filters-search-query`}
          text={translate('cms_errorsPage_filterItem_search') + ' ' + searchQuery}
          onClick={resetQuery}
        />
      );
    }
  };
  const filtersElement = getFilters();
  const filtersWrapper = filtersElement ? 'has-items' : '';
  const filteredData = filterData(errorsData, searchQuery);
  const disabledClassName = isLoading ? 'disabled' : '';

  return (
    <div className={'errors-page-wrapper'}>
      <div className="top-area">
        <SearchBox
          ref={searchRef}
          placeholder={translate('cms_errorsPage_searchBox_placeholder')}
          onSubmit={onSearchSubmit}
        />

        <ExcelButton methodName="getErrors" />
      </div>
      <div className={`filters-wrapper${conditionalClassName(filtersWrapper)}`}>
        <FilterItem phantom />
        {filtersElement}
      </div>
      <table className={'table-wrapper'}>
        <thead>
        <tr className={'table-row header'}>
          <th className={'table-cell header size-350'}>{translate('cms_errorsPage_column_key')}</th>
          <th className={'table-cell header size-500'}>{translate('cms_errorsPage_column_value')}</th>
          <th className={'table-cell header size-150'}>{translate('cms_errorspage_column_gdshow')}</th>
          <th className={'table-cell header size-150'}>{translate('cms_errorsPage_column_actions')}</th>
        </tr>
        </thead>
        <tbody>
        <tr className={`table-row${conditionalClassName(disabledClassName)}`}>
          <td className={'table-cell'}>
            <input
              className={'errors-input'}
              type={'text'}
              value={form.key.value}
              name={'key'}
              onChange={onChangeForm}
              pattern={/[A-Za-z_]\w+\s/g}
              disabled={isLoading}
            />
          </td>
          <td className={'table-cell'}>
                        <textarea
                          name={'value'}
                          className={'errors-value'}
                          value={form.value.value}
                          onChange={onChangeForm}
                          disabled={isLoading}
                        />
          </td>
          <td className={'table-cell center'}>
            <Checkbox
              name={'showOnGd'}
              checked={form.showOnGd.value}
              onChange={onChangeForm}
            />
          </td>
          <td className={'table-cell'}>
            <ActionButton
              disabled={isLoading}
              text={translate('cms_errorsPage_entry_add')}
              icon={PlusIcon}
              onClick={onAddHandler}
            />
          </td>
        </tr>
        {
          filteredData.length > 0 ? Object.values(filteredData).map((data, index) => {
            return (
              <ErrorEntry
                key={`texts-table-entry-${data.key}-${index}`}
                id={data.key}
                value={data.value}
                showOnGd={data.gd}
                paramID={data.id}
              />
            );
          }) : (
            <tr className={'table-row no-result'}>
              <td colSpan={4} className={'table-cell no-result'}>
                {translate('cms_tableData_noResult')}
              </td>
            </tr>
          )
        }
        </tbody>
      </table>
    </div>
  );
};

export default ErrorsPage;

function filterData(data, query) {
  if (Object.keys(data).length > 0) {
    const new_state = [];
    data.map((errorField) => {
      const keyName = errorField.key_error;
      const valName = errorField.value;
      const gd = errorField.gd;
      if (keyName.toLowerCase().includes(query.toLowerCase()) ||
        valName.toLowerCase().includes(query.toLowerCase())) {
        new_state.push({ id: errorField.id, key: keyName, value: valName, gd: gd });
      }
    });
    return new_state;
  }

  return {};
}

function getInitialFormState() {
  return {
    value: {
      value: '',
      rules: ['not_empty'],
      errMsg: '',
      valid: false,
    },
    key: {
      value: '',
      rules: ['not_empty'],
      errMsg: '',
      valid: false,
    },
    showOnGd: {
      value: false,
      rules: ['no_validation'],
      errMsg: '',
      valid: false,
    },
  };
}
