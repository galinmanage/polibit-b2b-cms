import { ActionButton } from 'components';
import { useEffect, useRef, useState } from 'react';

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

const MediaEntry = (props) => {
  const { id, imageKey, title, alt, width, height, url } = props;

  const translate = useTranslations();
  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const [editable, setEditable] = useState(false);
  const [form, updateForm] = useState(getInitialForm());
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!editable) {
      updateForm(getInitialForm());
    }
  }, [editable]);

  function getInitialForm() {
    return {
      key: {
        value: imageKey ?? '',
        valid: true,
        errMsg: '',
        rules: ['not_empty'],
      },
      title: {
        value: title ?? '',
        errMsg: '',
        valid: true,
        rules: ['not_empty'],
      },
      alt: {
        value: alt ?? '',
        errMsg: '',
        valid: true,
        rules: ['not_empty'],
      },
      width: {
        value: width ?? '',
        errMsg: '',
        valid: true,
        rules: [],
      },
      height: {
        value: height ?? '',
        errMsg: '',
        valid: true,
        rules: [],
      },
      file: {
        file: null,
        errMsg: '',
        valid: true,
      },
    };
  }

  const validFileTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  const onEditClick = () => {
    setEditable(true);
    updateForm(getInitialForm());
  };

  const onChangeHandler = (e, validTypes) => {
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

    const newForm = {
      key: { ...form.key },
      title: { ...form.title },
      alt: { ...form.alt },
      width: { ...form.width },
      height: { ...form.height },
      file: {
        file: form.file.file,
        errMsg: form.file.errMsg,
        valid: form.file.valid,
      },
    };

    if (type === 'file') {
      newForm[name].file = value;
      newForm[name].valid = !!value;
      newForm[name].errMsg = value ? '' : 'File is required';
    } else {
      const validationObj = Validate(value, newForm[name].rules);
      newForm[name].valid = validationObj.valid;
      newForm[name].errMsg = validationObj.msg;
      newForm[name].value = value;
    }

    updateForm(newForm);
  };

  const onSaveEdit = () => {
    let isFormValid = true;
    const newForm = JSON.parse(JSON.stringify(form));

    for (const field in newForm) {
      if (field === 'file') continue;

      const validationObj = Validate(
        newForm[field].value,
        newForm[field].rules,
      );
      newForm[field].valid = validationObj.valid;
      newForm[field].errMsg = validationObj.msg;
      if (!validationObj.valid) {
        isFormValid = false;
      }
    }

    updateForm(newForm);

    if (isFormValid) {
      setIsUpdating(true);

      const formData = new FormData();
      formData.append('key', newForm.key.value);
      formData.append('title', newForm.title.value);
      formData.append('alt', newForm.alt.value);
      formData.append('width', newForm.width.value);
      formData.append('height', newForm.height.value);

      const hasFileToReplace = form.file.file instanceof File;
      const fileToReplace = form.file.file;

      const props = {
        payload: formData,
        onSuccess: (res) => {
          dispatch(
            Actions.updateImage({
              id: parseInt(id),
              key: newForm.key.value,
              title: newForm.title.value,
              alt: newForm.alt.value,
              width: newForm.width.value,
              height: newForm.height.value,
            }),
          );

          if (hasFileToReplace && fileToReplace) {
            const replaceFormData = new FormData();
            replaceFormData.append('file', fileToReplace);

            const replaceProps = {
              payload: replaceFormData,
              onSuccess: (replaceRes) => {
                setIsUpdating(false);
                setEditable(false);

                dispatch(
                  Actions.replaceImage({
                    id: parseInt(id),
                    url: replaceRes.data.url,
                  }),
                );

                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }

                updateForm(getInitialForm());

                toast.success(
                  translate('cms_mediaPage_editAndReplaceSuccess').replace(
                    '{key}',
                    newForm.key.value,
                  ),
                );
              },
              onFailure: (error) => {
                setIsUpdating(false);
                toast.warning(
                  translate('cms_mediaPage_editSuccessReplaceFailed').replace(
                    '{key}',
                    newForm.key.value,
                  ),
                );
                if (error?.response?.status === 502) {
                  toast.error(translate('cms_mediaPage_storageError'));
                }
                setEditable(false);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
                updateForm(getInitialForm());
              },
            };

            Api.replaceImage(id, replaceProps);
          } else {
            setIsUpdating(false);
            setEditable(false);

            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }

            updateForm(getInitialForm());

            toast.success(
              translate('cms_mediaPage_editSuccess').replace(
                '{key}',
                newForm.key.value,
              ),
            );
          }
        },
        onFailure: (error) => {
          setIsUpdating(false);
          if (error?.response?.status === 409) {
            toast.error(translate('cms_mediaPage_keyExists'));
          } else if (error?.response?.status === 502) {
            toast.error(translate('cms_mediaPage_storageError'));
          }
        },
      };

      Api.updateImageMeta(id, props);
    }
  };

  const onEditCancel = () => {
    setEditable(false);
    updateForm(getInitialForm());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getEditableButtons = () => {
    return (
      <>
        <ActionButton
          text={translate('cms_mediaPage_entry_save')}
          icon={CheckMark}
          onClick={onSaveEdit}
          disabled={isUpdating}
        />
        <ActionButton
          text={translate('cms_mediaPage_entry_cancel')}
          icon={XIcon}
          onClick={onEditCancel}
        />
      </>
    );
  };

  const onDeleteClick = () => {
    const handleImageDelete = () => {
      const onDeleteSuccess = () => {
        dispatch(Actions.removeImage(id));
        toast.success(
          translate('cms_mediaPage_removeSuccess').replace('{key}', imageKey),
        );
      };

      const onDeleteFailure = (error) => {
        if (error?.response?.status === 502) {
          toast.error(translate('cms_mediaPage_storageError'));
        }
      };

      const props = {
        onSuccess: onDeleteSuccess,
        onFailure: onDeleteFailure,
      };

      Api.deleteImage(id, props);
    };

    const popupTextTranslation = translate('delete_image_are_you_sure');
    const popupText = Array.isArray(popupTextTranslation)
      ? popupTextTranslation[0]
      : popupTextTranslation;
    const formattedPopupText = popupText.replace('{key}', imageKey);

    dispatch(
      Actions.addPopup({
        type: popupTypes.CONFIRM_ACTION,
        payload: {
          text: formattedPopupText,
          onConfirmClick: handleImageDelete,
        },
      }),
    );
  };

  const getDisabledButtons = () => {
    return (
      <>
        <ActionButton
          text={translate('cms_mediaPage_entry_edit')}
          icon={EditIcon}
          onClick={onEditClick}
        />
        <ActionButton
          text={translate('cms_mediaPage_entry_remove')}
          icon={TrashIcon}
          onClick={onDeleteClick}
        />
      </>
    );
  };

  return (
    <tr className={`table-row`}>
      <td className={'table-cell center'}>
        {!editable ? (
          <div className={'media-preview-wrapper'}>
            <img
              src={`${url}?t=${Date.now()}`}
              alt={alt || imageKey}
              className={'media-preview-image'}
              onError={(e) => {
                e.target.src = '/placeholder-image.png';
              }}
            />
          </div>
        ) : (
          <div className={'replace-file-section'}>
            <input
              ref={fileInputRef}
              className={'media-file-input-small'}
              type={'file'}
              name={'file'}
              onChange={(e) => onChangeHandler(e, validFileTypes)}
              accept={validFileTypes.join(',')}
            />
            {form.file.file && (
              <div className={'file-selected-indicator'}>
                <span>✓ {form.file.file.name}</span>
              </div>
            )}
          </div>
        )}
      </td>
      <td className={'table-cell'}>
        <input
          className={'media-input'}
          type={'text'}
          value={form.key.value}
          onChange={onChangeHandler}
          name={'key'}
          disabled={!editable}
        />
      </td>
      <td className={'table-cell'}>
        <input
          className={'media-input'}
          type={'text'}
          value={form.title.value}
          onChange={onChangeHandler}
          name={'title'}
          disabled={!editable}
        />
      </td>
      <td className={'table-cell'}>
        <input
          className={'media-input'}
          type={'text'}
          value={form.alt.value}
          onChange={onChangeHandler}
          name={'alt'}
          disabled={!editable}
        />
      </td>
      <td className={'table-cell'}>
        {editable ? (
          <div className={'dimensions-input-wrapper'}>
            <input
              className={'media-input dimension'}
              type={'number'}
              value={form.width.value}
              onChange={onChangeHandler}
              name={'width'}
              placeholder="W"
            />
            <span>×</span>
            <input
              className={'media-input dimension'}
              type={'number'}
              value={form.height.value}
              onChange={onChangeHandler}
              name={'height'}
              placeholder="H"
            />
          </div>
        ) : (
          <span className={'dimensions-display'}>
            {width && height ? `${width} × ${height}` : '-'}
          </span>
        )}
      </td>
      <td className={'table-cell'}>
        {editable ? <>{getEditableButtons()}</> : getDisabledButtons()}
      </td>
    </tr>
  );
};

export default MediaEntry;
