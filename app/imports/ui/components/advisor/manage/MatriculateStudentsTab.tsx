import React, { useState } from 'react';
import { Confirm, Message, Tab } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoFields, AutoForm, ErrorsField, SubmitField } from 'uniforms-semantic';
import { matriculateStudentMethod } from '../../../../api/user/StudentProfileCollection.methods';
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
    tempSchema[r.userID] = { type: Boolean, label: r.username, optional: true };
  });
  const [data, setData] = useState({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const schema = new SimpleSchema(tempSchema);
  const formSchema = new SimpleSchema2Bridge(schema);
  const handleSubmit = () => {
    setOpenConfirm(false);
    for (const [studentID] of Object.entries(data)) {
      matriculateStudentMethod.callPromise(studentID)
        .then(() => console.log(`Removed student ${studentID}`))
        .catch((error) => console.error(error));
    }
  };
  return (
    <Tab.Pane>
      <Message info>You should dump the database before matriculating the students. This will delete their
                records.</Message>
      <AutoForm schema={formSchema} onSubmit={(model) => {
        setData(model);
        setOpenConfirm(true);
      }}>
        <RadGradHeader title='Matriculate Retired Students'/>
        <AutoFields/>
        <SubmitField/>
        <ErrorsField/>
      </AutoForm>
      <Confirm onConfirm={handleSubmit} onCancel={() => setOpenConfirm(false)} open={openConfirm}
        content='Are you sure you want to matriculate these students?'/>
    </Tab.Pane>
  );
};

export default MatriculateStudentsTab;
