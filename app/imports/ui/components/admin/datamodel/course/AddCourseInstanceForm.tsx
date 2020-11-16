import React from 'react';
import _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField, NumField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { IAcademicTerm, ICourse, IStudentProfile } from '../../../../../typings/radgrad';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';
import { CourseInstances } from '../../../../../api/course/CourseInstanceCollection';
import { academicTermToName, courseToName, profileToName } from '../../../shared/utilities/data-model';

interface IAddCourseInstanceFormProps {
  terms: IAcademicTerm[];
  courses: ICourse[];
  students: IStudentProfile[];
  formRef: any;
  handleAdd: (doc) => any;
}

const AddCourseInstanceForm = (props: IAddCourseInstanceFormProps) => {
  const termNames = _.map(props.terms, academicTermToName);
  const currentTermName = AcademicTerms.toString(AcademicTerms.getCurrentTermID(), false);
  const courseNames = _.map(props.courses, courseToName);
  const studentNames = _.map(props.students, profileToName);
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
      <AutoForm schema={formSchema} onSubmit={props.handleAdd} ref={props.formRef} showInlineError>
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
