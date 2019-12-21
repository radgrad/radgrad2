import * as React from 'react';
import { Header } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import SimpleSchema from 'simpl-schema';

interface IRequestVerificationFormProps {
  handleOnModelChange: (model) => any;
}

const RequestVerificationForm = (props: IRequestVerificationFormProps) => {
  const schema = new SimpleSchema({
    documentation: String,
  });
  return (
    <div>
      <Header dividing>Request Verification</Header>
      <AutoForm schema={schema} onSubmit={props.handleOnModelChange}>
        <LongTextField name="documentation" placeholder="Describe your participation in this opportunity." />
        <SubmitField inputRef={undefined} value="Request verification" disabled={false} className="" />
      </AutoForm>
    </div>
  );
};

export default RequestVerificationForm;
