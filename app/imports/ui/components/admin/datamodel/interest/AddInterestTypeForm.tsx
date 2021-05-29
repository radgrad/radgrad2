import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, BoolField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { InterestTypes } from '../../../../../api/interest/InterestTypeCollection';
import RadGradAlerts from '../../../../utilities/RadGradAlert';

const RadGradAlert = new RadGradAlerts();

const AddInterestTypeForm: React.FC = () => {
  let formRef;
  const handleAdd = (doc) => {
    // console.log('InterestTypes.handleAdd(%o)', doc);
    const collectionName = InterestTypes.getCollectionName();
    const definitionData = doc;
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error) => {
        RadGradAlert.failure('Failed adding User', error.message, 2500, error);
      })
      .then(() => {
        RadGradAlert.success('Add User Succeeded', '', 1500);
        formRef.reset();
      });
  };

  return (
    <Segment padded>
      <Header dividing>Add Interest Type</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={new SimpleSchema2Bridge(InterestTypes.getDefineSchema())} onSubmit={handleAdd}
        /* eslint-disable-next-line no-return-assign */
        ref={(ref) => formRef = ref}
        showInlineError>
        <Form.Group widths="equal">
          <TextField name="slug" />
          <TextField name="name" />
        </Form.Group>
        <LongTextField name="description" />
        <BoolField name="retired" />
        <SubmitField className="mini basic green" value="Add" disabled={false} inputRef={undefined} />
        <ErrorsField />
      </AutoForm>
    </Segment>
  );
};

export default AddInterestTypeForm;
