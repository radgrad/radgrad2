import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import { Interest } from '../../../../../typings/radgrad';
import { docToName } from '../../../shared/utilities/data-model';

interface AddCareerGoalFormProps {
  interests: Interest[];
  formRef: React.RefObject<unknown>;
  handleAdd: (doc) => any;
}

const AddCareerGoalForm: React.FC<AddCareerGoalFormProps> = ({ interests, formRef, handleAdd }) => {
  const interestNames = interests.map(docToName);
  const schema = new SimpleSchema({
    name: String,
    slug: String,
    description: String,
    interests: {
      type: Array,
    },
    'interests.$': {
      type: String,
      allowedValues: interestNames,
    },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Add Career Goal</Header>
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={formRef} showInlineError>
        <Form.Group widths="equal">
          <TextField name="name" placeholder="Software Engineer" />
          <TextField name="slug" placeholder="software-engineer" />
        </Form.Group>
        <MultiSelectField name="interests" placeholder="Select interest(s)" />
        <LongTextField name="description" placeholder="Describe the Career Goal here" />
        <SubmitField className="basic green" value="Add" />
      </AutoForm>
    </Segment>
  );
};

export default AddCareerGoalForm;
