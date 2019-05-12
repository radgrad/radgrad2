import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { profileToName, userIdToName } from '../shared/AdminDataModelHelperFunctions';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { IStudentProfile } from '../../../typings/radgrad'; // eslint-disable-line
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line

interface IUpdateFeedbackInstanceFormProps {
  students: IStudentProfile[];
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

class UpdateFeedbackInstanceForm extends React.Component<IUpdateFeedbackInstanceFormProps> {
  constructor(props) {
    super(props);
    // console.log('UpdateFeedbackInstance props=%o', props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const model = this.props.collection.findDoc(this.props.id);
    model.user = userIdToName(model.userID);
    const studentNames = _.map(this.props.students, profileToName);
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
      <Segment padded={true}>
        <Header dividing={true}>Update {this.props.collection.getType()}: {this.props.itemTitleString(model)}</Header>
        <AutoForm
          ref={this.props.formRef}
          schema={schema}
          model={model}
          onSubmit={this.props.handleUpdate}>
          <Form.Group>
            <SelectField name="user"/>
            <SelectField name="functionName"/>
            <SelectField name="feedbackType"/>
          </Form.Group>
          <LongTextField name="description"/>
          <BoolField name="retired"/>
          <SubmitField/>
          <Button onClick={this.props.handleCancel}>Cancel</Button>
        </AutoForm>
      </Segment>);
  }
}

const UpdateFeedbackInstanceFormContainer = withTracker(() => ({
  students: StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch(),
}))(UpdateFeedbackInstanceForm);

export default UpdateFeedbackInstanceFormContainer;
