import React from 'react';
import _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField, NumField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AcademicTerm, Course, StudentProfile } from '../../../../../typings/radgrad';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';
import { CourseInstances } from '../../../../../api/course/CourseInstanceCollection';
import { academicTermToName, courseToName, profileToName } from '../../../shared/utilities/data-model';

interface AddCourseInstanceFormProps {
  terms: AcademicTerm[];
  courses: Course[];
  students: StudentProfile[];
  formRef: React.RefObject<unknown>;
  handleAdd: (doc) => any;
}

const AddCourseInstanceForm: React.FC<AddCourseInstanceFormProps> = ({ terms, courses, students, formRef, handleAdd }) => {
  const termNames = _.map(terms, academicTermToName);
  const currentTermName = AcademicTerms.toString(AcademicTerms.getCurrentTermID(), false);
  const courseNames = _.map(courses, courseToName);
  const studentNames = _.map(students, profileToName);
  const schema = new SimpleSchema({
    term: {
      type: String,
      allowedValues: termNames,
      defaultValue: currentTermName,
    },
    course: {
      type: String,
      allowedValues: courseNames,
      defaultValue: courseNames[0],
    },
    student: {
      type: String,
      allowedValues: studentNames,
      defaultValue: studentNames[0],
    },
    creditHours: {
      type: SimpleSchema.Integer,
      optional: true,
    },
    grade: {
      type: String,
      allowedValues: CourseInstances.validGrades,
    },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  // console.log(termNames, courseNames, studentNames);
  return (
    <Segment padded>
      <Header dividing>Add Course Instance</Header>
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={formRef} showInlineError>
        <Form.Group widths="equal">
          <SelectField name="term" />
          <SelectField name="course" />
        </Form.Group>
        <Form.Group widths="equal">
          <SelectField name="student" />
          <NumField name="creditHours" />
          <SelectField name="grade" />
        </Form.Group>
        <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined} />
      </AutoForm>
    </Segment>
  );
};

export default AddCourseInstanceForm;
