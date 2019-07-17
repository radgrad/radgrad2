import * as React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import NumField from 'uniforms-semantic/NumField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { withTracker } from 'meteor/react-meteor-data';
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line
import { Interests } from '../../../api/interest/InterestCollection';
import { ICourse, IInterest } from '../../../typings/radgrad'; // eslint-disable-line
import {
  courseSlugToName, courseToName,
  docToName,
  interestIdToName,
} from '../shared/AdminDataModelHelperFunctions';
import MultiSelectField from '../shared/MultiSelectField';
import { Courses } from '../../../api/course/CourseCollection';

interface IUpdateCourseFormProps {
  collection: BaseCollection;
  interests: IInterest[];
  courses: ICourse[];
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
    model.prerequisiteNames = _.map(model.prerequisites, courseSlugToName);
    const interestNames = _.map(this.props.interests, docToName);
    const courseNames = _.map(this.props.courses, courseToName);
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
      syllabus: { type: String, optional: true },
      interests: Array,
      'interests.$': {
        type: String,
        allowedValues: interestNames,
      },
      prerequisiteNames: { type: Array, optional: true },
      'prerequisiteNames.$': { type: String, allowedValues: courseNames },
      retired: { type: Boolean, optional: true },
    });
    // console.log(model, schema);
    return (
      <Segment padded={true}>
        <Header dividing={true}>Update {this.props.collection.getType()}: {this.props.itemTitleString(model)}</Header>
        <AutoForm schema={schema} onSubmit={this.props.handleUpdate} ref={this.props.formRef}
                  showInlineError={true} model={model}>
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
            <MultiSelectField name="interests"/>
            <MultiSelectField name="prerequisiteNames"/>
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

const UpdateCourseFormContainer = withTracker(() => {
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  const courses = Courses.find({}, { sort: { num: 1 } }).fetch();
  return {
    courses,
    interests,
  };
})(UpdateCourseForm);

export default UpdateCourseFormContainer;
