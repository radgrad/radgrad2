import React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { profileToName, userIdToName } from '../../../../../../app/imports/ui/components/shared/utilities/data-model';
import { FeedbackFunctions } from '../../../../../api/feedback/FeedbackFunctions';
import { FeedbackInstances } from '../../../../../api/feedback/FeedbackInstanceCollection';
import { StudentProfile } from '../../../../../../app/imports/typings/radgrad';
import BaseCollection from '../../../../../../app/imports/api/base/BaseCollection';

interface UpdateFeedbackInstanceFormProps {
  students: StudentProfile[];
  collection: BaseCollection;
  id: string;
  formRef: React.RefObject<unknown>;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateFeedbackInstanceForm: React.FC<UpdateFeedbackInstanceFormProps> = ({ students, collection, id, formRef, handleCancel, handleUpdate, itemTitleString }) => {
  const model = collection.findDoc(id);
  model.user = userIdToName(model.userID);
  const studentNames = students.map(profileToName);
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
  // console.log(model);
  return (
    <Segment padded>
      <Header dividing>
        Update
        {collection.getType()}:{itemTitleString(model)}
      </Header>
      <AutoForm ref={formRef} schema={formSchema} model={model} onSubmit={handleUpdate}>
        <Form.Group>
          <SelectField name="user" />
          <SelectField name="functionName" />
          <SelectField name="feedbackType" />
        </Form.Group>
        <LongTextField name="description" />
        <BoolField name="retired" />
        <SubmitField inputRef={undefined} value="Update" disabled={false} className="" />
        <Button onClick={handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateFeedbackInstanceForm;
