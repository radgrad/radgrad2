import React from 'react';
import classnames from 'classnames';
import { connectField, filterDOMProps } from 'uniforms';
import { Dropdown } from 'semantic-ui-react';

/* eslint react/prop-types: 0 */
const renderDropdown = ({ id, allowedValues, disabled, placeholder, onChange, transform, value }) => {
  // console.log('renderMultiSelect value=%o allowedValues=%o', value, allowedValues);
  const options = allowedValues.map((val, index) => ({
    key: index,
    text: transform ? transform(val) : val,
    value: val,
  }));
  return <Dropdown id={id} fluid multiple placeholder={placeholder} selection disabled={disabled} options={options} onChange={(event, data) => onChange(data.value)} value={value} />;
};

const MultiSelect = ({ allowedValues, checkboxes, className, disabled, error, errorMessage, fieldType, id, inputRef, label, name, onChange, placeholder, required, showInlineError, transform, value, ...props }) => (
  <div className={classnames({ disabled, error, required }, className, 'field')} {...filterDOMProps(props)}>
    {label && <label htmlFor={id}>{label}</label>}
    {renderDropdown({
      id,
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
