import React, { useState } from 'react';
import { Form, Radio } from 'semantic-ui-react';

interface RadGradHeaderOptionsProps {
  label: string;
  values: Array<string>;
  initialValue: string;
  handleChange: (newValue: string) => void;
}

const RadGradHeaderOptions: React.FC<RadGradHeaderOptionsProps> = ({ label, values, initialValue, handleChange }) => {
  const [checkState, setCheckState] = useState(initialValue);
  const localHandleChange = (e, { value }) => { setCheckState(value); handleChange(value); };
  return (
    <Form>
      <Form.Group inline style={{ margin: 0 }}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>{label}</label>
        {values.map(value => <Form.Field control={Radio} key={value} label={value} value={value} checked={checkState === value} onChange={localHandleChange} /> )}
      </Form.Group>
    </Form>
  );
};

export default RadGradHeaderOptions;
