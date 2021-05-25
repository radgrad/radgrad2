import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, BoolField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { InterestTypes } from '../../../../../api/interest/InterestTypeCollection';
import { defineCallback } from '../utilities/add-form';


const AddInterestTypeForm: React.FC = () => {
  let formRef;
  const handleAdd = (doc) => {
    // console.log('InterestTypes.handleAdd(%o)', doc);
    const collectionName = InterestTypes.getCollectionName();
    const definitionData = doc;
    defineMethod.call({ collectionName, definitionData }, defineCallback(formRef));
  };

  return (
        <Segment padded>
            <Header dividing>Add Interest Type</Header>
            {/* eslint-disable-next-line no-return-assign */}
            <AutoForm schema={new SimpleSchema2Bridge(InterestTypes.getDefineSchema())} onSubmit={handleAdd}
                      ref={(ref) => formRef = ref}
                      showInlineError>
                <Form.Group widths="equal">
                    <TextField name="slug"/>
                    <TextField name="name"/>
                </Form.Group>
                <LongTextField name="description"/>
                <BoolField name="retired"/>
                <SubmitField className="mini basic green" value="Add" disabled={false} inputRef={undefined}/>
                <ErrorsField/>
            </AutoForm>
        </Segment>
  );
};

export default AddInterestTypeForm;
