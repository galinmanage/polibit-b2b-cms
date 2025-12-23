import React from 'react';
import AnimatedInput from '../forms/animated_input';
import { ReactComponent as AddIcon } from 'assets/icons/add.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import './index.scss';
import Button from '../button';
import fieldTypesEnum from '../../constants/fieldTypesEnum';

const InputList = ((props) => {
  const {
    placeholder = '',
    addButtonText = '',
    name = '',
    data,
    fieldCall,
    handleInputListChange = () => {},
    handleInputListRemove = () => {},
    handleInputListAdd = () => {},
  } = props;

  return (
    <div className={'input-list'}>
      <div className={'inputs-container'}>

        {data && data.map((input, index) => {
          return (
            <React.Fragment key={index}>
              <div id={index} className={'input'}>
                {
                  index > 0 && (
                    <span className={'remove-input-icon-container'}
                          onClick={handleInputListRemove.bind(this, data, input, index)}>
                                            <CloseIcon />
                                        </span>
                  )
                }
                <AnimatedInput
                  className={'custom-input mt-30'}
                  name={name ?? 'drop' + parseInt(index + 1)}
                  value={input.name}
                  placeholder={placeholder + ' ' + parseInt(index + 1)}
                  onChange={(e) => handleInputListChange(e, index)}
                />
                {(fieldCall(fieldTypesEnum.DROPDOWN, index))}
              </div>
            </React.Fragment>
          );
        })}
        <Button
          className={'add-value-btn'}
          onClick={handleInputListAdd.bind(this, data)}
        >
          {addButtonText}
          <span className={'add-input-icon-container'}>
                        <AddIcon
                          className={'add-icon'}
                        />
                    </span>
        </Button>
      </div>
    </div>
  );
});

export default InputList;

