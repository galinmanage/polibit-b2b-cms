import useTranslations from '../../../../../../app/hooks/useTranslations';
import React, { useEffect, useState } from 'react';
import { ReactComponent as AddIcon } from 'assets/icons/add.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import AnimatedInput from '../../../../../../components/forms/animated_input';
import { Dropdown } from 'components';

const MAX_QUESTIONS_ALLOWED = 5;

// This is suppose to be recursive
export default function QuestionComponent(props) {
  const {
    selectedComponent,
    handleData,
    data,
    deleteField = () => {},
    dropdownOptions,
  } = props;
  const translate = useTranslations();
  const [inputs, setInputs] = useState([]);
  const firstOptionsKey = Object.keys(dropdownOptions)[0];
  const initObj = { id: 0, name: '', results: firstOptionsKey };
  const isNewInputAvailable = inputs?.length < MAX_QUESTIONS_ALLOWED;

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      let newData = JSON.parse(JSON.stringify(data));
      setInputs(newData);
    } else {
      setInputs([initObj]);
    }
  }, []);

  const addInput = () => {
    const new_state = [...inputs];
    new_state.push(initObj);
    setInputs(new_state);
    handleData(new_state);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    const new_state = [...inputs];
    new_state[name].name = value;
    setInputs(new_state);

    handleData(new_state);
  };

  const removeInput = (input) => {
    let new_state = [...inputs];
    new_state.pop();
    setInputs(new_state);

    deleteField(input);
    handleData(new_state);
  };

  const handleChangeDropDown = (index, name, value) => {
    const new_state = [...inputs];
    new_state[index].results = value;
    setInputs(new_state);
    handleData(new_state);
  };

  return (
    <>
      {
        inputs.map((input, index) => {
          return (
            <div key={index} className={'input-container'}>
              {
                index > 0 && (
                  <span className={'remove-input-icon-container'}
                        onClick={removeInput.bind(this, input, index)}>
                                            <CloseIcon />
                                        </span>
                )
              }
              <AnimatedInput
                key={index}
                name={index}
                placeholder={translate('cms_fieldspage_addquestion')}
                className={'new-field-input mt-30'}
                value={input.name}
                onChange={onChange}
              />

              <Dropdown
                className={'custom-dropdown'}
                name={'results'}
                value={input.results}
                onChange={(name, value) => handleChangeDropDown(index, name, value)}
                options={dropdownOptions}
              />
            </div>
          );
        })
      }
      {
        isNewInputAvailable &&
        <button className={'button-wrapper add-value-btn'} onClick={addInput}>
          {translate('cms_fieldspage_addquestion')}
          <span className={'add-input-icon-container'}>
                            <AddIcon
                              className={'add-icon'}
                            />
                    </span>
        </button>
      }
    </>
  );
}
