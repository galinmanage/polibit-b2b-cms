import React, { useEffect, useState } from 'react';
import InputList from '../../../../components/input-list';
import AnimatedInput from '../../../../components/forms/animated_input';
import Dropdown from '../../../../components/dropdown';
import FieldEntity from '../../../../entities/Field';
import useTranslations from '../../../../app/hooks/useTranslations';
import QuestionComponent from './components/questionInput';
import Api from 'api/requests';
import useDropdownData from 'app/hooks/useDropdownData';
import { EXCEL_EXPORT_KEY } from 'constants/export-to-excel';
import './index.scss';

const MAX_LEVEL = 3;
export default function Field(
  {
    newFieldForm,
    fieldOptions,
    fieldOptionsQuestionDrop,
    fieldOptionsLastDrop,
    fieldOptionsNoQuestion,
    fieldServicesQuestion,
    currentLevel = 1,
  }) {
  const translate = useTranslations();
  const [_, forceUpdate] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState(0);
  const dropdownData = useDropdownData(fieldOptions);

  useEffect(() => {
    setSelectedComponent(newFieldForm?.results);
  }, []);
  const dropDownValue = newFieldForm?.results;
  const figureOrFileValue = newFieldForm?.figure_or_file_name;

  const handleChangeDropDown = (name, value) => {
    handleAction(value);
    setSelectedComponent(value);
    newFieldForm?.setResults(value);
    forceUpdate(prev => prev + 1);
  };

  const onChange = (e) => {
    const { value } = e.target;
    handleAction(selectedComponent, value);
    forceUpdate(prev => prev + 1);
  };

  const handleObjectChange = (question, file, figure, extra_info, figure_or_file, results, dropdown) => {
    newFieldForm?.setIsFile(file);
    newFieldForm?.setIsFigure(figure);
    newFieldForm?.setIsExtraInfo(extra_info);
    newFieldForm?.setFigureOrFileName(figure_or_file);
    newFieldForm?.setResults(results);
    newFieldForm?.setNumOfServices(0);
    !question ? newFieldForm?.setIsQuestions(false) : newFieldForm?.setIsQuestions(question);

    !dropdown && newFieldForm?.setDropdown(false);
    dropdown && !newFieldForm.is_dropdown &&
    newFieldForm.setDropdown([new FieldEntity()]);

    dropdown && addNumOfService();
  };

  const handleAction = (id, value) => {
    switch (id) {
      case 1:
      case 2:
      case 3:
      case 12:
        handleObjectChange(false, false, false, false, '', id, false);
        break;
      case 4:
      case 5:
        handleObjectChange(false, false, false, false, '', id, 1);
        break;
      case 6:
        handleObjectChange(false, 1, false, false, value, id, false);
        break;
      case 7:
        handleObjectChange(false, false, 1, false, value, id, false);
        break;
      case 8:
        handleObjectChange(false, false, 1, false, value, id, 1);
        break;
      case 9:
        handleObjectChange(false, 1, false, false, value, id, 1);
        break;
      case 10:
        handleObjectChange(false, false, false, 1, '', id, false);
        break;
      case 11:
        handleObjectChange(false, false, false, 1, '', id, 1);
        break;
      case 13:
        handleObjectChange(true, false, false, false, '', id, false);
        break;
      default:
        break;
    }
  };

  const components = {
    1: { component: () => processFinish() },
    2: { component: () => processFinish() },
    3: { component: () => processFinish() },
    4: { component: () => processService() },
    5: { component: () => processDropDown() },
    6: { component: () => processFile() },
    7: { component: () => processFigure() },
    8: { component: () => <>{processFigure()}{processService()}</> },
    9: { component: () => <>{processFile()}{processService()}</> },
    10: { component: () => processFinish() },
    11: { component: () => processService() },
    12: { component: () => processFinish() },
    13: { component: () => processQuestion() },
  };

  const addNumOfService = () => {
    if (Array.isArray(newFieldForm?.is_dropdown)) {
      newFieldForm?.setNumOfServices(newFieldForm?.is_dropdown.length);
    }
  };

  const handleInputListChange = (event, index) => {
    const { value } = event.target;
    newFieldForm?.is_dropdown[index]?.setName(value);
    forceUpdate(prev => prev + 1);
  };
  const handleInputListRemove = (data, input, index) => {
    const newFields = [...data];
    newFields.splice(index, 1);
    newFieldForm?.setDropdown(newFields);
    deleteField(input);
    forceUpdate(prev => prev + 1);
    addNumOfService();
  };

  const handleInputListAdd = (inputs) => {
    const new_inputs = inputs && Array.isArray(inputs) ? [...inputs] : [];
    new_inputs.push(new FieldEntity());
    newFieldForm?.setDropdown(new_inputs);
    forceUpdate(prev => prev + 1);

    addNumOfService();
  };

  const processFinish = () => <></>;

  const processQuestion = () => {
    const handleData = (data) => {
      newFieldForm?.setIsQuestions(data);
    };

    return (
      <QuestionComponent
        selectedComponent={selectedComponent}
        data={newFieldForm?.is_question}
        deleteField={deleteField}
        handleData={handleData}
        dropdownOptions={fieldOptionsLastDrop}
      />
    );
  };

  const deleteField = (field) => {
    if (!field.id) return;

    const props = { payload: { id: parseInt(field.id) } };
    Api.deleteField(props).then(res => {
      Api.getFields({ payload: { [EXCEL_EXPORT_KEY]: 0, config: { method: 'GET' } } }); // add filters here
    });
  };

  const processService = () => {
    return (
      <InputList
        name={'is_dropdown'}
        placeholder={translate('cms_fieldsPage_serviceValue')}
        addButtonText={translate('cms_fieldsPage_addButtonService')}
        fieldCall={fieldCall}
        handleInputListAdd={handleInputListAdd}
        handleInputListChange={handleInputListChange}
        handleInputListRemove={handleInputListRemove}
        data={newFieldForm?.is_dropdown}
      />
    );
  };

  const processDropDown = () => {
    return (
      <InputList
        name={'is_dropdown'}
        placeholder={translate('cms_fieldsPage_dropValue')}
        addButtonText={translate('cms_fieldsPage_addButtonDrop')}
        fieldCall={fieldCall}
        handleInputListAdd={handleInputListAdd}
        handleInputListChange={handleInputListChange}
        handleInputListRemove={handleInputListRemove}
        data={newFieldForm?.is_dropdown}
      />
    );
  };

  const processFigure = () => {
    return (
      <AnimatedInput
        name={'is_figure'}
        placeholder={translate('cms_fieldsPage_addFigureHeadline')}
        className={'new-field-input mt-30'}
        value={figureOrFileValue}
        onChange={onChange}
      />
    );
  };

  const processFile = () => {
    return (
      <AnimatedInput
        name={'is_file'}
        placeholder={translate('cms_fieldsPage_addDocumentHeadline')}
        className={'new-field-input mt-30'}
        value={figureOrFileValue}
        onChange={onChange}
      />
    );
  };
  const handleFieldOptions = () => {
    const LAST_LEVEL = currentLevel === MAX_LEVEL - 1;
    const NO_QUESTION = currentLevel >= 1;
    const SELECTED_SERVICES = parseInt(newFieldForm.results) === 4;
    let options = fieldOptions;

    if (SELECTED_SERVICES) {
      options = fieldServicesQuestion;
    } else if (LAST_LEVEL) {
      options = fieldOptionsLastDrop;
    } else if (NO_QUESTION) {
      options = fieldOptionsNoQuestion;
    }

    return options;
  };

  const fieldCall = (name, id) => {
    let dropdownOptions = handleFieldOptions();
    return <Field
      key={id}
      id={id}
      newFieldForm={newFieldForm?.[name][id]}
      fieldOptions={dropdownOptions}
      fieldOptionsQuestionDrop={fieldOptionsQuestionDrop}
      fieldOptionsLastDrop={fieldOptionsLastDrop}
      fieldOptionsNoQuestion={fieldOptionsNoQuestion}
      fieldServicesQuestion={fieldServicesQuestion}
      currentLevel={currentLevel + 1}
    />;
  };

  return currentLevel <= MAX_LEVEL && (
    <div className={'new-field-container'} style={{ marginRight: (currentLevel) + 10 + 'px' }}>
      <Dropdown
        name={'dropdown'}
        className={'custom-dropdown'}
        value={dropDownValue}
        onChange={handleChangeDropDown}
        options={dropdownData()}
      />
      <div className={'data-container'} style={{ marginRight: (currentLevel) + 10 + 'px' }}>
        {selectedComponent > 0 && currentLevel < MAX_LEVEL && components[selectedComponent].component()}
      </div>
    </div>
  );
}

