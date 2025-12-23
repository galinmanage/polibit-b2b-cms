import { ReactComponent as AddIcon } from 'assets/icons/add.svg';
import ExcelButton from 'components/excel-button';
import { EXCEL_EXPORT_KEY } from 'constants/export-to-excel';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Actions from 'redux/actions';
import Api from '../../api/requests';
import useTranslations from '../../app/hooks/useTranslations';
import { Button } from '../../components';
import popupTypes from '../../constants/popup-types';
import FieldsTable from './component/fields-table';
import './index.scss';

export default function FieldsPage(props) {

  const fieldsData = useSelector(store => store.fieldsData.fields);

  const [fieldOptions, setFieldOptions] = useState({});
  const [fieldOptionsNoQuestion, setFieldOptionsNoQuestion] = useState({});
  const [fieldOptionsLastDrop, setFieldOptionsLastDrop] = useState({});
  const [fieldOptionsQuestionDrop, setFieldOptionsQuestionDrop] = useState({});
  const [fieldServicesQuestion, setFieldServicesQuestion] = useState({});

  const translate = useTranslations();
  const dispatch = useDispatch();

  useEffect(() => {
    const props = {
      payload: { [EXCEL_EXPORT_KEY]: 0 },
      config: { method: 'GET' },
    };

    Api.getFields(props);

    Api.getFieldsOptions({ config: { method: 'GET' } }).then(res => {
      const responseObject = res.data.occupation_choices;
      setFieldOptions(responseObject.drop_choices);
      setFieldOptionsNoQuestion(responseObject.drop_choices_no_question);
      setFieldOptionsLastDrop(responseObject.last_drop_choices);
      setFieldOptionsQuestionDrop(responseObject.question_drop_choices);
      setFieldServicesQuestion(responseObject.drop_choices_no_question_and_description);
    });
  }, []);

  function onAddField() {
    dispatch(Actions.addPopup({
      type: popupTypes.NEW_FIELD,
      payload: {
        isEdit: false,
        fieldOptions: fieldOptions,
        fieldOptionsQuestionDrop,
        fieldOptionsLastDrop,
        fieldOptionsNoQuestion,
        fieldServicesQuestion,
      },
    }));
  }

  return (
    <div className={'fields-page-container'}>
      <div className="buttons-container">
        <Button
          className={'add-field-button'}
          onClick={onAddField}>
                    <span className={'add-text'}>
                        {translate('cms_fieldsPage_addField')}
                    </span>
          <span className={'add-field-icon-container'}>
                        <AddIcon className={'add-field-icon'} />
                    </span>
        </Button>

        <ExcelButton methodName="getFields" />
      </div>

      <FieldsTable
        data={fieldsData}
        fieldOptions={fieldOptions}
        fieldOptionsQuestionDrop={fieldOptionsQuestionDrop}
        fieldOptionsLastDrop={fieldOptionsLastDrop}
        fieldOptionsNoQuestion={fieldOptionsNoQuestion}
        fieldServicesQuestion={fieldServicesQuestion}
      />
    </div>
  );
}
