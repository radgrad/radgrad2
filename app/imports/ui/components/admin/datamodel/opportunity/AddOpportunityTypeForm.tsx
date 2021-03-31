import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { OpportunityTypes } from '../../../../../api/opportunity/OpportunityTypeCollection';
import slugify from '../../../../../api/slug/SlugCollection';
import { defineCallback } from '../utilities/add-form';

const AddOpportunityTypeForm: React.FC = () => {
  let formRef;
  const handleAdd = (doc) => {
    // console.log('OpportunityTypes.handleAdd(%o)', doc);
    const collectionName = OpportunityTypes.getCollectionName();
    const definitionData = doc;
    definitionData.slug = `${slugify(doc.name)}-opportunity-type`;
    defineMethod.call({ collectionName, definitionData }, defineCallback(formRef));
  };

  const schema = new SimpleSchema({
    name: String,
    slug: String,
    description: String,
    retired: { type: Boolean, optional: true },
  });

  return (
    <Segment padded>
      <Header dividing>Add Interest Type</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={new SimpleSchema2Bridge(schema)} onSubmit={handleAdd} ref={(ref) => formRef = ref}
                showInlineError>
        <Form.Group widths="equal">
          <TextField name="name" />
        </Form.Group>
        <LongTextField name="description" />
        <BoolField name="retired" />
        <SubmitField className="mini basic green" value="Add" disabled={false} inputRef={undefined} />
      </AutoForm>
    </Segment>
  );
};

export default AddOpportunityTypeForm;
