import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { profileToName } from '../../../shared/utilities/data-model';
import { FeedbackFunctions } from '../../../../../api/feedback/FeedbackFunctions';
import { FeedbackInstances } from '../../../../../api/feedback/FeedbackInstanceCollection';
import { StudentProfile } from '../../../../../typings/radgrad';

interface AddFeedbackInstanceFormProps {
  students: StudentProfile[];
  formRef: React.RefObject<unknown>;
  handleAdd: (doc) => any;
}

const AddFeedbackInstanceForm: React.FC<AddFeedbackInstanceFormProps> = ({ students, formRef, handleAdd }) => {
  const studentNames = students.map(profileToName);
  // console.log(FeedbackFunctions.feedbackFunctionNames);
  const schema = new SimpleSchema({
    user: { type: String, allowedValues: studentNames, defaultValue: studentNames[0] },
    functionName: {
      type: String,
      allowedValues: FeedbackFunctions.feedbackFunctionNames,
      defaultValue: FeedbackFunctions.feedbackFunctionNames[0],
    },
    description: String,
    feedbackType: {
      type: String,
      allowedValues: FeedbackInstances.feedbackTypes,
      defaultValue: FeedbackInstances.feedbackTypes[0],
    },
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Add Feedback Instance</Header>
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={formRef} showInlineError>
        <Form.Group>
          <SelectField name="user" />
          <SelectField name="functionName" />
          <SelectField name="feedbackType" />
        </Form.Group>
        <LongTextField name="description" />
        <BoolField name="retired" />
        <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined} />
      </AutoForm>
    </Segment>
  );
};
export default AddFeedbackInstanceForm;
