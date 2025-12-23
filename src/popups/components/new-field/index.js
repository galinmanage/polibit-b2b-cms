import React, { useEffect, useRef, useState } from 'react';
import './index.scss';
import SlidePopup from 'popups/presets/slide-popup';
import useTranslations from 'app/hooks/useTranslations';
import AnimatedInput from '../../../components/forms/animated_input';
import Field from './field';
import FieldEntity from '../../../entities/Field';
import Api from 'api/requests';
import { useDispatch } from 'react-redux';
import PopupButton from '../add-button';
import { EXCEL_EXPORT_KEY } from 'constants/export-to-excel';

const NewFieldsPopup = (props) => {
  const { payload = {} } = props;
  const {
    isEdit = false, fieldOptions, data, fieldOptionsQuestionDrop,
    fieldOptionsNoQuestion, fieldOptionsLastDrop, fieldServicesQuestion,
  } = payload;
  const ref = useRef();
  const [fieldData, setFieldData] = useState(data);
  const [_, forceUpdate] = useState(0);
  const translate = useTranslations();
  const dispatch = useDispatch();
  const onSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    let new_state = {};
    if (!isEdit) {
      new_state = new FieldEntity('');
    } else {
      new_state = buildExistField(new_state, fieldData);
      new_state.setId(fieldData?.id);
      data.cal_code && new_state.setCalCode(data.cal_code);
      data.grow_id && new_state.setGrowId(data.grow_id);
    }
    setFieldData(new_state);
  }, []);

  const buildExistField = (obj, data) => {
    /*
        We are getting the data as an array,
        We are changing all of the layers to type FieldEntity
    */
    if ((!Array.isArray(data) && data.length === 0) || data === 0) {
      return;
    }
    if (Array.isArray(data)) {
      data.forEach((val, index) => {
        obj.is_dropdown.push(new FieldEntity(
          val?.name,
          val?.results,
          val?.num_of_services,
          val?.is_file,
          val?.is_figure,
          val?.is_extra_info,
          val?.figure_or_file_name,
          val?.id,
          val?.is_question,
        ));
        if (Array.isArray(val.is_dropdown) && val.is_dropdown.length > 0) {
          obj.is_dropdown[index].is_dropdown = [];
        }
        buildExistField(obj.is_dropdown[index], val.is_dropdown);
      });
    } else {
      obj = new FieldEntity(
        data?.name,
        data?.results,
        data?.num_of_services,
        data?.is_file,
        data?.is_figure,
        data?.is_extra_info,
        data?.figure_or_file_name,
        data?.id,
        data?.is_question,
      );
      obj.is_dropdown = [];
      buildExistField(obj, data.is_dropdown);
    }
    return obj;
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cal_code' && !isNaN(value)) {
      fieldData?.setCalCode(value ? parseInt(value) : '');
    } else if (name === 'name') {
      fieldData?.setName(value);
    } else if (name === 'grow_id') {
      fieldData?.setGrowId(value);
    }

    forceUpdate(prev => prev + 1);
  };

  const addField = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const onSuccess = (res) => {
      ref?.current?.animateOut();
      Api.getFields({ payload: { [EXCEL_EXPORT_KEY]: 0 }, config: { method: 'GET' } });
    };

    const props = {
      onSuccess,
      payload: { ...fieldData, ...(fieldData.grow_id === '' ? { grow_id: 0 } : { grow_id: fieldData.grow_id }) },
    };

    Api.addUpdateField(props);
  };

  return (
    <SlidePopup ref={ref}>
      <div className="new-field-popup-wrapper">
        <div className="popup-header">
          <h1
            className={'new-field-headline'}>{translate(`cms_fieldspage_${isEdit ? 'edit' : 'addd'}field_headlinee`)}</h1>
        </div>
        <form className={'new-field-form'} onSubmit={onSubmit}>
          <div className={'row'}>
            <AnimatedInput
              name={'cal_code'}
              placeholder={translate('cms_fieldsPage_calCode')}
              className={'new-field-input'}
              value={fieldData?.cal_code}
              onChange={onChange}
            />

            <AnimatedInput
              name={'name'}
              placeholder={translate('cms_fields_page_occupation')}
              className={'new-field-input'}
              value={fieldData?.name}
              onChange={onChange}
            />

            <AnimatedInput
              name={'grow_id'}
              placeholder={translate('cms_fields_page_occupation_grow_id')}
              className={'new-field-input'}
              value={fieldData?.grow_id}
              onChange={onChange}
            />
          </div>

          {
            <Field
              fieldOptions={fieldOptions}
              newFieldForm={fieldData}
              fieldOptionsQuestionDrop={fieldOptionsQuestionDrop}
              fieldOptionsLastDrop={fieldOptionsLastDrop}
              fieldOptionsNoQuestion={fieldOptionsNoQuestion}
              fieldServicesQuestion={fieldServicesQuestion}
            />
          }

          <PopupButton onClick={addField}
                       className={'mt-30 add-field'}>{translate('cms_fieldspage_savefield')}</PopupButton>
        </form>
      </div>
    </SlidePopup>
  );
};

export default NewFieldsPopup;



