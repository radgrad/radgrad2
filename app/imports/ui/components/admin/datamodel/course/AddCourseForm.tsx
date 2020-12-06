import React from 'react';
import _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, NumField, LongTextField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import { ICourse, IInterest } from '../../../../../typings/radgrad';
import { courseToName, docToName } from '../../../shared/utilities/data-model';

interface IAddCourseFormProps {
  interests: IInterest[];
  courses: ICourse[];
  formRef: any;
  handleAdd: (doc) => any;
}

const AddCourseForm: React.FC<IAddCourseFormProps> = ({ interests, courses, formRef, handleAdd }) => {
  const interestNames = _.map(interests, docToName);
  const courseNames = _.map(courses, courseToName);
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
    num: String,
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
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Add Course</Header>
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={formRef} showInlineError>
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

export default AddCourseForm;
