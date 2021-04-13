import React from 'react';
import { Header } from 'semantic-ui-react';
import { AutoForm, LongTextField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

interface RequestVerificationFormProps {
  handleOnModelChange: (model) => any;
}

const RequestVerificationForm: React.FC<RequestVerificationFormProps> = ({ handleOnModelChange }) => {
  const schema = new SimpleSchema({
    documentation: String,
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <div>
      <Header dividing>Request Verification</Header>
      <AutoForm schema={formSchema} onSubmit={handleOnModelChange}>
        <LongTextField name="documentation" placeholder="Describe your participation in this opportunity." />
        <SubmitField inputRef={undefined} value="Request Verification" disabled={false} className="" />
      </AutoForm>
    </div>
  );
};

export default RequestVerificationForm;
