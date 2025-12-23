import Api from 'api/requests';
import { conditionalClassName } from 'app/functions';
import useTranslations from 'app/hooks/useTranslations';
import Validate from 'app/validation/validation';
import PlusIcon from 'assets/icons/add.svg';
import { ActionButton, Button, Dropdown, FilterItem, SearchBox } from 'components';
import regex from 'constants/regex';
import { useEffect, useRef, useState } from 'react';
import TextEntry from './components/text-entry';
import './index.scss';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../redux/actions';
import popupTypes from '../../constants/popup-types';
import FieldError from '../../components/forms/field-error';
import { toast } from 'react-toastify';

const headers = [
  { text: 'cms_textsPage_column_key', width: 350 },
  { text: 'cms_textsPage_column_namespace', width: 250 },
  { text: 'cms_textsPage_column_value', width: 500 },
  { text: 'cms_textsPage_column_actions' },
];

const TextsPage = (props) => {
  const searchRef = useRef();
  const translate = useTranslations();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNameSpace, setSelectedNameSpace] = useState('');
  const [isFetchingDone, setIsFetchingDone] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const translations = useSelector(store => store.translations?.texts) ?? [];
  const namespaces = useSelector(store => store.translations?.namespaces) ?? [];

  useEffect(() => {
    const props = {
      onFinally: () => setIsFetchingDone(true),
    };
    Api.getTranslations(props);
    Api.getNamespaces();
  }, []);

  const [form, updateForm] = useState(getInitialFormState());

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

  const onNamespaceClick = (namespace) => {
    setSelectedNameSpace(prev => prev === namespace ? '' : namespace);
  };

  const onDropdownChange = (name, value) => {
    const newForm = JSON.parse(JSON.stringify(form));
    const validationObj = Validate(value, newForm[name].rules);
    newForm[name].errMsg = validationObj.msg;
    newForm[name].valid = validationObj.valid;
    newForm[name].value = value;
    updateForm(newForm);
  };

  const onSearchSubmit = (value) => {
    setSearchQuery(value);
  };

  const onAddText = () => {
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
      const onSuccess = (res) => {
        updateForm(getInitialFormState());
        dispatch(Actions.addText({
          id: res.id,
          key: newForm.key.value,
          value: newForm.value.value,
          namespaceId: namespaces[newForm.namespace.value].id,
          namespaceName: namespaces[newForm.namespace.value].name,
        }));
        const message = translate('cms_textsPage_addSuccess').replace('{key}', form.key.value);
        toast.success(message);
      };
      const props = {
        onSuccess,
        payload: {
          namespaceId: namespaces[newForm.namespace.value].id,
          key: newForm.key.value,
          value: newForm.value.value,
        },
      };
      Api.addTranslation(props);
    }
  };

  const onManageNamespaceClick = () => {
    dispatch(Actions.addPopup({
      type: popupTypes.MANAGE_NAMESPACES,
    }));
  };

  const onSyncTranslationsClick = () => {
    setIsSyncing(true);
    const props = {
      onSuccess: (res) => {
        let count = 0;
        if (Array.isArray(res?.translations_inserted)) {
          count = Math.min(...res.translations_inserted);
        } else {
          count = res?.translations_inserted || 0;
        }
        const message = translate('cms_textsPage_sync_translations_success')
          .replace('{count}', count);
        toast.success(message);
        setIsSyncing(false);
      },
      onFailure: (error) => {
        setIsSyncing(false);
      },
    };
    Api.syncTranslations(props);
  };

  const getFilters = () => {
    if (searchQuery) {
      const resetQuery = () => {
        setSearchQuery('');
        searchRef.current?.reset();
      };
      return (<FilterItem
          key={`texts-page-filters-search-query`}
          text={translate('cms_usersPage_filterItem_search') + ' ' + searchQuery}
          onClick={resetQuery}
        />
      );
    }
  };

  const filtersElement = getFilters();
  const filtersWrapper = filtersElement ? 'has-items' : '';
  const filteredData = filterData(translations, searchQuery, selectedNameSpace);
  return (
    <div className={'texts-page-wrapper'}>
      <div className="top-area">
        <div className="buttons-container">
          <SearchBox
            ref={searchRef}
            placeholder={translate('cms_textsPage_searchBox_placeholder')}
            onSubmit={onSearchSubmit}
          />
          <Button
            className={'add-namespace-btn'}
            onClick={onManageNamespaceClick}
          >
            {translate('cms_textsPage_namespaces_addNamespace')}
          </Button>
          {process.env.REACT_APP_ENV === 'stage' && (
            <Button
              className={'sync-translations-btn'}
              onClick={onSyncTranslationsClick}
              disabled={isSyncing}
            >
              {translate('cms_textsPage_sync_translations')}
            </Button>
          )}
        </div>
      </div>
      <div className={`filters-wrapper${conditionalClassName(filtersWrapper)}`}>
        <FilterItem phantom />
        {filtersElement}
      </div>
      <div className={'namespaces-wrapper'}>
        {namespaces.map((namespace, i) => (
          <FilterItem
            key={`namespace-${namespace.name}-${i}`}
            text={namespace.name}
            removeIcon={true}
            className={`namespace-tag${conditionalClassName(selectedNameSpace === namespace.id ? 'selected' : '')}`}
            onClick={() => onNamespaceClick(namespace.id)}
          />
        ))}
      </div>
      <table className={'table-wrapper'}>
        <thead>
        <tr className={'table-row header'}>
          {headers.map(({ text, width = 150 }, idx) => (
            <th key={`${text}-${idx}`} className={`table-cell header size-${width}`}>
              {translate(text)}
            </th>
          ))}
        </tr>
        </thead>
        <tbody>
        <tr className={`table-row input`}>
          <td className={'table-cell'}>
            <input
              className={'texts-input'}
              type={'text'}
              value={form.key.value}
              name={'key'}
              onChange={onChangeForm}
              required={true}
            />
            <FieldError
              errorMessage={form.key.errMsg}
              isThereError={!form.key.valid}
              floatingError={true}
            />
          </td>
          <td className={'table-cell center'}>
            <Dropdown
              name={'namespace'}
              className={'namespace-select-wrapper'}
              placeholder={translate('cms_textsPage_column_namespace_placeholder')}
              value={form.namespace.value}
              onChange={onDropdownChange}
              options={namespaces}
              nameKey={'name'}
            />
            <FieldError
              errorMessage={form.namespace.errMsg}
              isThereError={!form.namespace.valid}
              floatingError={true}
            />
          </td>
          <td className={'table-cell'}>
            <textarea
              name={'value'}
              className={'texts-value'}
              value={form.value.value?.replaceAll(regex.BOLD_HTML, regex.TEMPLATE_BOLD_TEXT)}
              onChange={onChangeForm}
              required={true}
            />
            <FieldError
              errorMessage={form.value.errMsg}
              isThereError={!form.value.valid}
              floatingError={true}
            />
          </td>
          <td className={'table-cell'}>
            <ActionButton
              text={translate('cms_textsPage_entry_add')}
              icon={PlusIcon}
              onClick={onAddText}
            />
          </td>
        </tr>
        {filteredData.length > 0 ? (
          Object.values(filteredData).map((data, index) => (
            <TextEntry
              key={`texts-table-entry-${data.key}-${index}`}
              id={data.key}
              value={data.value}
              namespace={data.namespaceName}
              paramID={data.id} />
          ))
        ) : (
          <tr className={'table-row no-result'}>
            <td colSpan={4} className={'table-cell no-result'}>
              {isFetchingDone ? translate('cms_tableData_noResult') : translate('cms_table_data_fetching')}
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
};

export default TextsPage;

function filterData(data, query, selectedNamespace) {
  if (Object.keys(data).length > 0) {
    const new_state = [];
    data.map((translationField) => {
      const { id, key, value, namespaceName, namespaceId } = translationField;
      if ((key.toLowerCase().includes(query.toLowerCase()) ||
          value.toLowerCase().includes(query.toLowerCase())) &&
        (selectedNamespace ? namespaceId === selectedNamespace : true)
      ) {
        new_state.push({ id, key, value, namespaceName });
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
    namespace: {
      value: '',
      rules: ['not_empty'],
      errMsg: '',
      valid: false,
    },
  };
}
