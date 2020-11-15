import React from 'react';
import _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { StudentProfiles } from '../../../../../api/user/StudentProfileCollection';
import { profileToName } from '../../../shared/utilities/data-model';
import { FeedbackFunctions } from '../../../../../api/feedback/FeedbackFunctions';
import { FeedbackInstances } from '../../../../../api/feedback/FeedbackInstanceCollection';
import { IStudentProfile } from '../../../../../typings/radgrad';

interface IAddFeedbackInstanceFormProps {
  students: IStudentProfile[];
  formRef: any;
  handleAdd: (doc) => any;
}

const AddFeedbackInstanceForm = (props: IAddFeedbackInstanceFormProps): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined => {
  const studentNames = _.map(props.students, profileToName);
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
      <AutoForm schema={formSchema} onSubmit={props.handleAdd} ref={props.formRef} showInlineError>
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

const AddFeedbackInstanceFormContainer = withTracker(() => ({
  students: StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch(),
}))(AddFeedbackInstanceForm);

export default AddFeedbackInstanceFormContainer;
