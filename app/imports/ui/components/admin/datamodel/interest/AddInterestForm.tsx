import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, LongTextField, BoolField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { Interests } from '../../../../../api/interest/InterestCollection';
import slugify from '../../../../../api/slug/SlugCollection';
import { InterestType } from '../../../../../typings/radgrad';
import { docToName, interestTypeNameToSlug } from '../../../shared/utilities/data-model';
import { defineCallback } from '../utilities/add-form';

interface AddInterestFormProps {
  interestTypes: InterestType[];
}

const AddInterestForm: React.FC<AddInterestFormProps> = ({ interestTypes }) => {
  let formRef;
  const handleAdd = (doc) => {
    // console.log('Interests.handleAdd(%o)', doc);
    const collectionName = Interests.getCollectionName();
    const definitionData = doc;
    definitionData.slug = `${slugify(doc.name)}-interests`;
    definitionData.interestType = interestTypeNameToSlug(doc.interestType);
    // console.log(collectionName, definitionData);
    defineMethod.call({ collectionName, definitionData }, defineCallback(formRef));
  };


  const interestTypeNames = interestTypes.map(docToName);
  const schema = new SimpleSchema({
    name: String,
    interestType: { type: String, allowedValues: interestTypeNames, defaultValue: interestTypeNames[0] },
    description: String,
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Add Interest</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={(ref) => formRef = ref} showInlineError>
        <Form.Group widths="equal">
          <TextField name="name" placeholder="Rust Programming Language" />
          <SelectField name="interestType" />
        </Form.Group>
        <LongTextField name="description" />
        <BoolField name="retired" />
        <SubmitField className="mini basic green" value="Add" disabled={false} inputRef={undefined} />
          <ErrorsField/>
      </AutoForm>
    </Segment>
  );
};

export default AddInterestForm;
