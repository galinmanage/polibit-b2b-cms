import Api from 'api/requests';
import { conditionalClassName } from 'app/functions';
import useTranslations from 'app/hooks/useTranslations';
import Validate from 'app/validation/validation';
import PlusIcon from 'assets/icons/add.svg';
import { ActionButton, FilterItem, SearchBox } from 'components';
import { useEffect, useRef, useState } from 'react';
import MediaEntry from './components/media-entry';
import './index.scss';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../redux/actions';
import FieldError from '../../components/forms/field-error';
import { toast } from 'react-toastify';

const headers = [
  { text: 'cms_mediaPage_column_preview' },
  { text: 'cms_mediaPage_column_key' },
  { text: 'cms_mediaPage_column_title' },
  { text: 'cms_mediaPage_column_alt' },
  { text: 'cms_mediaPage_column_dimensions' },
  { text: 'cms_mediaPage_column_actions' },
];

const MediaPage = (props) => {
  const searchRef = useRef();
  const fileInputRef = useRef();
  const translate = useTranslations();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFetchingDone, setIsFetchingDone] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const images = useSelector((store) => store.mediaData?.images) ?? [];
  useEffect(() => {
    const props = {
      onFinally: () => setIsFetchingDone(true),
    };
    Api.getAllImages(props);
  }, []);

  const [form, updateForm] = useState(getInitialFormState());

  const validFileTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  const onChangeForm = (e, validTypes) => {
    let { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      value = checked;
    }

    if (type === 'file') {
      const file = files[0];
      if (file) {
        if (!validTypes.includes(file.type)) {
          toast.error(translate('cms_mediaPage_invalidFileType'));
          return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          toast.error(translate('cms_mediaPage_fileTooLarge'));
          return;
        }

        value = file;
      }
    }

    if (name === 'key' && value.charAt(value.length - 1) === ' ') {
      if (value.length > 2 && value.charAt(value.length - 2) === '_') {
        return;
      }
      value = value.slice(0, value.length - 1) + '_';
    }

    const newForm = {
      ...form,
    };

    if (type === 'file') {
      newForm[name].file = value;
      newForm[name].valid = !!value;
      newForm[name].errMsg = value ? '' : 'File is required';
    } else {
      const validationObj = Validate(value, newForm[name].rules);
      newForm[name].errMsg = validationObj.msg;
      newForm[name].valid = validationObj.valid;
      newForm[name].value = value;
    }

    updateForm(newForm);
  };

  const onSearchSubmit = (value) => {
    setSearchQuery(value);
  };

  const onAddImage = () => {
    let formIsValid = true;
    const newForm = { ...form };

    // Validate file
    if (!newForm.file.file) {
      newForm.file.valid = false;
      newForm.file.errMsg = 'File is required';
      formIsValid = false;
    }

    // Validate other fields
    for (const field in newForm) {
      if (field === 'file') continue;

      const validationObj = Validate(
        newForm[field].value,
        newForm[field].rules,
      );
      newForm[field].valid = validationObj.valid;
      newForm[field].errMsg = validationObj.msg;
      if (!validationObj.valid) {
        formIsValid = false;
      }
    }

    updateForm(newForm);

    if (formIsValid) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', newForm.file.file);
      formData.append('key', newForm.key.value);
      formData.append('title', newForm.title.value);
      formData.append('alt', newForm.alt.value);
      formData.append('width', newForm.width.value);
      formData.append('height', newForm.height.value);

      const onSuccess = (res) => {
        setIsUploading(false);
        updateForm(getInitialFormState());
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        dispatch(
          Actions.addImage({
            id: res.id,
            key: newForm.key.value,
            title: newForm.title.value,
            alt: newForm.alt.value,
            width: newForm.width.value,
            height: newForm.height.value,
            url: res.data.url,
          }),
        );

        const message = translate('cms_mediaPage_addSuccess').replace(
          '{key}',
          newForm.key.value,
        );
        toast.success(message);
      };

      const onFailure = (error) => {
        setIsUploading(false);
        if (error?.response?.status === 409) {
          toast.error(translate('cms_mediaPage_keyExists'));
        } else if (error?.response?.status === 502) {
          toast.error(translate('cms_mediaPage_storageError'));
        }
      };
      const payload = formData;
      const props = {
        onSuccess,
        onFailure,
        payload: formData,
      };

      Api.createImage(props);
    }
  };

  const getFilters = () => {
    if (searchQuery) {
      const resetQuery = () => {
        setSearchQuery('');
        searchRef.current?.reset();
      };
      return (
        <FilterItem
          key={`media-page-filters-search-query`}
          text={
            translate('cms_mediaPage_filterItem_search') + ' ' + searchQuery
          }
          onClick={resetQuery}
        />
      );
    }
  };

  const filtersElement = getFilters();
  const filtersWrapper = filtersElement ? 'has-items' : '';
  const filteredData = filterData(images, searchQuery);

  return (
    <div className={'media-page-wrapper'}>
      <div className="top-area">
        <div className="buttons-container">
          <SearchBox
            ref={searchRef}
            placeholder={translate('cms_mediaPage_searchBox_placeholder')}
            onSubmit={onSearchSubmit}
          />
        </div>
      </div>
      <div className={`filters-wrapper${conditionalClassName(filtersWrapper)}`}>
        <FilterItem phantom />
        {filtersElement}
      </div>
      <table className={'table-wrapper'}>
        <thead>
        <tr className={'table-row header'}>
          {headers.map(({ text }, idx) => (
            <th key={`${text}-${idx}`} className={`table-cell header`}>
              {translate(text)}
            </th>
          ))}
        </tr>
        </thead>
        <tbody>
        <tr className={`table-row input`}>
          <td className={'table-cell center'}>
            <input
              ref={fileInputRef}
              className={'media-file-input'}
              type={'file'}
              name={'file'}
              onChange={(e) => onChangeForm(e, validFileTypes)}
              accept={validFileTypes.join(',')}
              required={true}
            />
            <FieldError
              errorMessage={form.file.errMsg}
              isThereError={!form.file.valid}
              floatingError={true}
            />
          </td>
          <td className={'table-cell'}>
            <input
              className={'media-input'}
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
          <td className={'table-cell'}>
            <input
              className={'media-input'}
              type={'text'}
              value={form.title.value}
              name={'title'}
              onChange={onChangeForm}
            />
            <FieldError
              errorMessage={form.title.errMsg}
              isThereError={!form.title.valid}
              floatingError={true}
            />
          </td>
          <td className={'table-cell'}>
            <input
              className={'media-input'}
              type={'text'}
              value={form.alt.value}
              name={'alt'}
              onChange={onChangeForm}
            />
            <FieldError
              errorMessage={form.alt.errMsg}
              isThereError={!form.alt.valid}
              floatingError={true}
            />
          </td>
          <td className={'table-cell'}>
            <div className={'dimensions-input-wrapper'}>
              <input
                className={'media-input dimension'}
                type={'number'}
                value={form.width.value}
                name={'width'}
                onChange={onChangeForm}
                placeholder="W"
              />
              <span>×</span>
              <input
                className={'media-input dimension'}
                type={'number'}
                value={form.height.value}
                name={'height'}
                onChange={onChangeForm}
                placeholder="H"
              />
            </div>
          </td>
          <td className={'table-cell'}>
            <ActionButton
              text={translate('cms_mediaPage_entry_add')}
              icon={PlusIcon}
              onClick={onAddImage}
              disabled={isUploading}
            />
          </td>
        </tr>
        {filteredData.length > 0 ? (
          filteredData.map((data, index) => (
            <MediaEntry
              key={`media-table-entry-${data.key}-${index}`}
              id={data.id}
              imageKey={data.key}
              title={data.title}
              alt={data.alt}
              width={data.width}
              height={data.height}
              url={data.url}
            />
          ))
        ) : (
          <tr className={'table-row no-result'}>
            <td colSpan={6} className={'table-cell no-result'}>
              {isFetchingDone
                ? translate('cms_tableData_noResult')
                : translate('cms_table_data_fetching')}
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
};

export default MediaPage;

function filterData(data, query) {
  if (Object.keys(data).length > 0) {
    const new_state = [];
    data?.forEach((image) => {
      const { id, key, title, alt, width, height, url } = image;
      if (
        (key && key.toLowerCase().includes(query?.toLowerCase())) ||
        (title && title.toLowerCase().includes(query.toLowerCase())) ||
        (alt && alt.toLowerCase().includes(query.toLowerCase()))
      ) {
        new_state.push({ id, key, title, alt, width, height, url });
      }
    });
    return new_state;
  }

  return [];
}

function getInitialFormState() {
  return {
    file: {
      file: null,
      errMsg: '',
      valid: false,
    },
    key: {
      value: '',
      rules: ['not_empty'],
      errMsg: '',
      valid: false,
    },
    title: {
      value: '',
      rules: ['not_empty'],
      errMsg: '',
      valid: false,
    },
    alt: {
      value: '',
      rules: ['not_empty'],
      errMsg: '',
      valid: true,
    },
    width: {
      value: '',
      rules: [],
      errMsg: '',
      valid: true,
    },
    height: {
      value: '',
      rules: [],
      errMsg: '',
      valid: true,
    },
  };
}
