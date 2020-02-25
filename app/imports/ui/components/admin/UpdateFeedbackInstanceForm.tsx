import React from 'react';
import _ from 'lodash';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { profileToName, userIdToName } from '../shared/data-model-helper-functions';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { IStudentProfile } from '../../../typings/radgrad';
import BaseCollection from '../../../api/base/BaseCollection';

interface IUpdateFeedbackInstanceFormProps {
  students: IStudentProfile[];
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateFeedbackInstanceForm = (props: IUpdateFeedbackInstanceFormProps) => {
  const model = props.collection.findDoc(props.id);
  model.user = userIdToName(model.userID);
  const studentNames = _.map(props.students, profileToName);
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
  // console.log(model);
  return (
    <Segment padded>
      <Header dividing>
        Update
        {props.collection.getType()}
        :
        {props.itemTitleString(model)}
      </Header>
      <AutoForm
        ref={props.formRef}
        schema={schema}
        model={model}
        onSubmit={props.handleUpdate}
      >
        <Form.Group>
          <SelectField name="user" />
          <SelectField name="functionName" />
          <SelectField name="feedbackType" />
        </Form.Group>
        <LongTextField name="description" />
        <BoolField name="retired" />
        <SubmitField inputRef={undefined} value="Update" disabled={false} className="" />
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
);
};

const UpdateFeedbackInstanceFormContainer = withTracker(() => ({
  students: StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch(),
}))(UpdateFeedbackInstanceForm);

export default UpdateFeedbackInstanceFormContainer;
