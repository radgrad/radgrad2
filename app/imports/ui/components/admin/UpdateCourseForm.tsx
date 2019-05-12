import * as React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import NumField from 'uniforms-semantic/NumField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { withTracker } from 'meteor/react-meteor-data';
import BaseCollection from '../../../api/base/BaseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { IInterest } from '../../../typings/radgrad';
import { docToName, interestIdToName } from '../shared/AdminDataModelHelperFunctions';

interface IUpdateCourseFormProps {
  collection: BaseCollection;
  interests: IInterest[];
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

class UpdateCourseForm extends React.Component<IUpdateCourseFormProps> {
  constructor(props) {
    super(props);
    // console.log('UpdateCourseForm props=%o', props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const model = this.props.id ? this.props.collection.findDoc(this.props.id) : undefined;
    model.interests = _.map(model.interestIDs, interestIdToName);
    model.prerequisites = model.prerequisites.join(',');
    // console.log(model);
    const interestNames = _.map(this.props.interests, docToName);
    const schema = new SimpleSchema({
      name: { type: String, optional: true },
      shortName: { type: String, optional: true },
      creditHrs: {
        type: SimpleSchema.Integer,
        optional: true,
        min: 1,
        max: 15,
        defaultValue: 3,
      },
      num: { type: String, optional: true },
      description: { type: String, optional: true },
      interests: Array,
      syllabus: { type: String, optional: true },
      'interests.$': {
        type: String,
        allowedValues: interestNames,
        // optional: true, CAM: not sure if we want this to be optional
      },
      prerequisites: { type: String, optional: true },
      retired: Boolean,
    });
    return (
      <Segment padded={true}>
        <Header dividing={true}>Update {this.props.collection.getType()}: {this.props.itemTitleString(model)}</Header>
        <AutoForm
          ref={this.props.formRef}
          schema={schema}
          model={model}
          onSubmit={this.props.handleUpdate}>
          <Form.Group widths="equal">
            <TextField name="name"/>
            <TextField name="shortName"/>
          </Form.Group>
          <Form.Group widths="equal">
            <NumField name="creditHrs"/>
            <TextField name="num"/>
          </Form.Group>
          <LongTextField name="description"/>
          <TextField name="syllabus"/>
          <Form.Group widths="equal">
            <SelectField name="interests"/>
            <TextField name="prerequisites" showInlineError={true}/>
          </Form.Group>
          <BoolField name="retired"/>
          <p/>
          <SubmitField/>
          <Button onClick={this.props.handleCancel}>Cancel</Button>
        </AutoForm>
      </Segment>
    );
  }
}

const UpdateCourseFormContainer = withTracker((props) => {
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  return {
    interests,
  };
})(UpdateCourseForm);

export default UpdateCourseFormContainer;
