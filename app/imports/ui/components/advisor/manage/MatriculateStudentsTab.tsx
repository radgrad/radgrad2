import React from 'react';
import { Tab } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoFields, AutoForm, ErrorsField, SubmitField } from 'uniforms-semantic';
import { StudentProfile } from '../../../../typings/radgrad';
import RadGradHeader from '../../shared/RadGradHeader';

interface MatriculateStudentsTabProps {
  students: StudentProfile[];
  alumni: StudentProfile[];
}

const MatriculateStudentsTab: React.FC<MatriculateStudentsTabProps> = ({ students, alumni }) => {
  const retiredStudents = students.filter((s) => s.retired);
  const retiredAlumni = alumni.filter((a) => a.retired);
  const retired = retiredAlumni.concat(retiredStudents);
  const tempSchema = {};
  retired.forEach((r) => {
    tempSchema[r._id] = { type: Boolean, label: r.username, optional: true };
  });
  console.log(tempSchema);
  const schema = new SimpleSchema(tempSchema);
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Tab.Pane>
      <AutoForm schema={formSchema} onSubmit={console.log} >
        <RadGradHeader title='Matriculate Retired Students' />
        <AutoFields />
        <ErrorsField />
        <SubmitField />
      </AutoForm>
    </Tab.Pane>
  );
};

export default MatriculateStudentsTab;
