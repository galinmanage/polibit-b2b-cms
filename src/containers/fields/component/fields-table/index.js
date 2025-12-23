import React from 'react';
import useTranslations from '../../../../app/hooks/useTranslations';
import EditIcon from 'assets/icons/edit.svg';

import './index.scss';
import { ActionButton } from '../../../../components';
import { useDispatch } from 'react-redux';
import popupTypes from '../../../../constants/popup-types';
import Actions from '../../../../redux/actions';

const headers = [
  { text: 'cms_fieldsPage_internalCode' },
  { text: 'cms_fieldsPage_calCode' },
  { text: 'cms_fields_page_occupation_grow_id' },
  { text: 'cms_fieldsPage_calCode_mainOccupation', width: 300 },
  { text: 'cms_fieldsPage_results', width: 250 },
  { text: 'cms_fieldsPage_actions' },
];

function FieldsTable(props) {
  const translate = useTranslations();
  const dispatch = useDispatch();

  const {
    data,
    fieldOptions,
    fieldOptionsQuestionDrop,
    fieldOptionsLastDrop,
    fieldOptionsNoQuestion,
    fieldServicesQuestion,
  } = props;

  const getResults = (resultsID) => {
    if (Object.keys(fieldOptions).length === 0) return;
    return fieldOptions[resultsID];
  };

  const onEditClick = (field) => {
    dispatch(Actions.addPopup({
      type: popupTypes.NEW_FIELD,
      payload: {
        isEdit: true,
        data: field,
        fieldOptions: fieldOptions,
        fieldOptionsQuestionDrop,
        fieldOptionsLastDrop,
        fieldOptionsNoQuestion,
        fieldServicesQuestion,
      },
    }));
  };

  return (
    <table className="table-wrapper">
      <thead>
      <tr className={'table-row header'}>
        {headers.map(({ text, width = 150 }, idx) => (
          <th key={`header-cell-${text}-${idx}`} className={`table-cell header size-${width}`}>
            {translate(text)}
          </th>
        ))}
      </tr>
      </thead>
      <tbody>
      {data?.map((field) => {
        return (
          <tr key={'field-table-' + field.id} className={'table-row'}>
            <td className={'table-cell'}>{field.id}</td>
            <td className={'table-cell'}>{field.cal_code}</td>
            <td className={'table-cell'}>{field.grow_id || ''}</td>
            <td className={'table-cell'}>{field.name}</td>
            <td className={'table-cell'}>{getResults(field.results)}</td>

            <td className={'table-cell center'}>
              <ActionButton text={translate('cms_fieldspage_edit')} icon={EditIcon}
                            onClick={onEditClick.bind(this, field)} />
            </td>
          </tr>
        );
      })}
      </tbody>
    </table>
  );
}

export default FieldsTable;
