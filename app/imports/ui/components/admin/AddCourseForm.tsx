import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import LongTextField from 'uniforms-semantic/LongTextField';
import NumField from 'uniforms-semantic/NumField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { Interests } from '../../../api/interest/InterestCollection';
import { IInterest } from '../../../typings/radgrad';
import { docToName } from '../shared/AdminDataModelHelperFunctions';

interface IAddCourseFormProps {
  interests: IInterest[];
  formRef: any;
  handleAdd: (doc) => any;
}

class AddCourseForm extends React.Component<IAddCourseFormProps> {
  constructor(props) {
    super(props);
    // console.log('AddCourseForm props=%o', props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const interestNames = _.map(this.props.interests, docToName);
    const schema = new SimpleSchema({
      slug: String,
      name: String,
      shortName: { type: String, optional: true },
      creditHours: {
        type: SimpleSchema.Integer,
        optional: true,
        min: 1,
        max: 15,
        defaultValue: 3,
      },
      number: String,
      description: String,
      interests: Array,
      syllabus: { type: String, optional: true },
      'interests.$': {
        type: String,
        allowedValues: interestNames,
        // optional: true, CAM: not sure if we want this to be optional
      },
      prerequisites: { type: String, optional: true },
    });
    return (
      <Segment padded={true}>
        <Header dividing={true}>Add Course</Header>
        <AutoForm schema={schema} onSubmit={this.props.handleAdd} ref={this.props.formRef} showInlineError={true}>
          <Form.Group widths="equal">
            <TextField name="slug" placeholder="dept_111"/>
            <TextField name="name" placeholder="DEPT 111 Introduction to Science"/>
          </Form.Group>
          <Form.Group widths="equal">
            <TextField name="shortName" placeholder="DEPT 111 Introduction to Science"/>
            <NumField name="creditHours"/>
            <TextField name="number" placeholder="DEPT 111"/>
          </Form.Group>
          <LongTextField name="description"/>
          <TextField name="syllabus" placeholder="https://dept.foo.edu/dept_111/syllabus.html"/>
          <Form.Group widths="equal">
            <SelectField name="interests"/>
            <TextField name="prerequisites" placeholder="dept_101, dept_110"/>
          </Form.Group>
          <SubmitField/>
        </AutoForm>
      </Segment>
    );
  }
}

const AddCourseFormContainer = withTracker((props) => {
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  return {
    interests,
  };
})(AddCourseForm);

export default AddCourseFormContainer;
