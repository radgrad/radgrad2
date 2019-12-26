import React from 'react';
import classnames from 'classnames';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import { Dropdown } from 'semantic-ui-react';
import _ from 'lodash';

/* eslint react/prop-types: 0 */
const renderDropdown = ({ allowedValues, disabled, placeholder, onChange, transform, value }) => {
  // console.log('renderMultiSelect value=%o allowedValues=%o', value, allowedValues);
  const options = _.map(allowedValues, (val, index) => ({
    key: index,
    text: transform ? transform(val) : val,
    value: val,
  }));
  return (
    <Dropdown
      fluid
      multiple
      placeholder={placeholder}
      selection
      disabled={disabled}
      options={options}
      onChange={(event, data) => onChange(data.value)}
      value={value}
    />
  );
};

const MultiSelect = ({
                       allowedValues,
                       checkboxes, // eslint-disable-line @typescript-eslint/no-unused-vars
                       className,
                       disabled,
                       error,
                       errorMessage,
                       fieldType, // eslint-disable-line @typescript-eslint/no-unused-vars
                       id,
                       inputRef, // eslint-disable-line @typescript-eslint/no-unused-vars
                       label,
                       name, // eslint-disable-line @typescript-eslint/no-unused-vars
                       onChange,
                       placeholder,
                       required,
                       showInlineError,
                       transform,
                       value,
                       ...props
                     }) => (
                       <div className={classnames({ disabled, error, required }, className, 'field')} {...filterDOMProps(props)}>
                         {label && <label htmlFor={id}>{label}</label>}
                         {renderDropdown({
      allowedValues,
      disabled,
      placeholder,
      onChange,
      transform,
      value,
    })}
                         {!!(error && showInlineError) && <div className="ui red basic pointing label">{errorMessage}</div>}
                       </div>
);


export default connectField(MultiSelect);
