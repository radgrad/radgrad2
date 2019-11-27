import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { profileToName } from '../shared/data-model-helper-functions';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { IStudentProfile } from '../../../typings/radgrad'; // eslint-disable-line

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
  return (
    <Segment padded={true}>
      <Header dividing={true}>Add Feedback Instance</Header>
      <AutoForm schema={schema} onSubmit={props.handleAdd} ref={props.formRef} showInlineError={true}>
        <Form.Group>
          <SelectField name="user"/>
          <SelectField name="functionName"/>
          <SelectField name="feedbackType"/>
        </Form.Group>
        <LongTextField name="description"/>
        <BoolField name="retired"/>
        <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined}/>
      </AutoForm>
    </Segment>
  );
};

const AddFeedbackInstanceFormContainer = withTracker(() => ({
  students: StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch(),
}))(AddFeedbackInstanceForm);

export default AddFeedbackInstanceFormContainer;
