import React from 'react';
import _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, NumField, LongTextField, SubmitField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import MultiSelectField from '../form-fields/MultiSelectField';
import { Interests } from '../../../api/interest/InterestCollection';
import { ICourse, IInterest } from '../../../typings/radgrad';
import { courseToName, docToName } from '../shared/data-model-helper-functions';
import { Courses } from '../../../api/course/CourseCollection';

interface IAddCourseFormProps {
  interests: IInterest[];
  courses: ICourse[];
  formRef: any;
  handleAdd: (doc) => any;
}

const AddCourseForm = (props: IAddCourseFormProps): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined => {
  const interestNames = _.map(props.interests, docToName);
  const courseNames = _.map(props.courses, courseToName);
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
    prerequisites: { type: Array, optional: true },
    'prerequisites.$': { type: String, allowedValues: courseNames },
  });
  return (
    <Segment padded>
      <Header dividing>Add Course</Header>
      <AutoForm schema={schema} onSubmit={props.handleAdd} ref={props.formRef} showInlineError>
        <Form.Group widths="equal">
          <TextField name="slug" placeholder="dept_111" />
          <TextField name="name" placeholder="DEPT 111 Introduction to Science" />
        </Form.Group>
        <Form.Group widths="equal">
          <TextField name="shortName" placeholder="DEPT 111 Introduction to Science" />
          <NumField name="creditHours" />
          <TextField name="num" placeholder="DEPT 111" />
        </Form.Group>
        <LongTextField name="description" />
        <TextField name="syllabus" placeholder="https://dept.foo.edu/dept_111/syllabus.html" />
        <Form.Group widths="equal">
          <MultiSelectField name="interests" placeholder="Select Interest(s)" />
          <MultiSelectField name="prerequisites" placeholder="Select Prerequisite(s)" />
        </Form.Group>
        <SubmitField className="basic green" value="Add" />
      </AutoForm>
    </Segment>
  );
};

const AddCourseFormContainer = withTracker(() => {
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  const courses = Courses.find({}, { sort: { num: 1 } }).fetch();
  return {
    courses,
    interests,
  };
})(AddCourseForm);

export default AddCourseFormContainer;
