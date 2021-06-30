import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField, NumField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../../../api/slug/SlugCollection';
import { AcademicTerm, Course, CourseInstanceDefine, StudentProfile } from '../../../../../typings/radgrad';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';
import { CourseInstances } from '../../../../../api/course/CourseInstanceCollection';
import { academicTermNameToDoc, academicTermToName, courseNameToCourseDoc, courseToName, profileNameToUsername, profileToName } from '../../../shared/utilities/data-model';
import RadGradAlert from '../../../../utilities/RadGradAlert';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';

interface AddCourseInstanceFormProps {
  terms: AcademicTerm[];
  courses: Course[];
  students: StudentProfile[];
}

const AddCourseInstanceForm: React.FC<AddCourseInstanceFormProps> = ({ terms, courses, students }) => {
  let formRef;
  const handleAdd = (doc) => {
    console.log('AddCourseInstanceForm.handleAdd', doc);
    const collectionName = CourseInstances.getCollectionName();
    const academicTermDoc = academicTermNameToDoc(doc.term);
    const academicTerm = Slugs.getNameFromID(academicTermDoc.slugID);
    const note = doc.course.substring(0, doc.course.indexOf(':'));
    const courseDoc = courseNameToCourseDoc(doc.course);
    const course = Slugs.getNameFromID(courseDoc.slugID);
    const student = profileNameToUsername(doc.student);
    const creditHrs = doc.creditHours;
    const grade = doc.grade;
    const definitionData: CourseInstanceDefine = {
      academicTerm,
      course,
      note,
      student,
      creditHrs,
      grade,
    };
    console.log('definitionData=', definitionData);
    defineMethod
      .callPromise({ collectionName, definitionData })
      .catch((error) => {
        RadGradAlert.failure('Failed adding Course Instance', error.message, error);
      })
      .then(() => {
        RadGradAlert.success('Add Course Instance Succeeded');
        formRef.reset();
      });
  };

  const termNames = terms.map(academicTermToName);
  const currentTermName = AcademicTerms.toString(AcademicTerms.getCurrentTermID(), false);
  const courseNames = courses.map(courseToName);
  const studentNames = students.map(profileToName);
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
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={(ref) => (formRef = ref)} showInlineError>
        <Form.Group widths="equal">
          <SelectField id={COMPONENTIDS.DATA_MODEL_ACADEMIC_TERM} name="term" />
          <SelectField id={COMPONENTIDS.DATA_MODEL_COURSE} name="course" />
        </Form.Group>
        <Form.Group widths="equal">
          <SelectField id={COMPONENTIDS.DATA_MODEL_STUDENT} name="student" />
          <NumField id={COMPONENTIDS.DATA_MODEL_CREDIT_HOURS} name="creditHours" />
          <SelectField id={COMPONENTIDS.DATA_MODEL_GRADE} name="grade" />
        </Form.Group>
        <SubmitField id={COMPONENTIDS.DATA_MODEL_SUBMIT} className="mini basic green" value="Add" disabled={false} inputRef={undefined} />
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
      </AutoForm>
    </Segment>
  );
};

export default AddCourseInstanceForm;
