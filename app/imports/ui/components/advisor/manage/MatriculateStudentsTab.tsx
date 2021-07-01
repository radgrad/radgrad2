import { ZipZap } from 'meteor/udondan:zipzap';
import React, { useState } from 'react';
import { Button, Confirm, Message, Tab } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { updateAllStudentsStatusMethod } from '../../../../api/user/StudentProfileCollection.methods';
import { StudentProfile } from '../../../../typings/radgrad';
import { COMPONENTIDS } from '../../../utilities/ComponentIDs';
import RadGradAlert from '../../../utilities/RadGradAlert';

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
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [resultString, setResultString] = useState('');
  const handleSubmit = () => {
    setOpenConfirm(false);
    setIsWorking(true);
    updateAllStudentsStatusMethod
      .callPromise(null)
      .then((result) => {
        const message = `Updated ${result.alumniCount} students to alumni.
        Retired ${result.retiredCount} alumni.
        Matriculated ${result.matriculatedCount} retired alumni.`;
        RadGradAlert.success('Updated Student Status', message);
        console.log(message);
        const markdownMessage = `
        * Updated ${result.alumniCount} students to alumni.
        * Retired ${result.retiredCount} alumni.
        * Matriculated ${result.matriculatedCount} retired alumni.`;
        setResultString(markdownMessage);
        const zip = new ZipZap();
        const dir = 'radgrad-student-matriculation';
        result.studentRecords.forEach((record) => {
          const fileName = `${dir}/${record.fileName}.json`;
          zip.file(fileName, JSON.stringify(record.contents, null, 2));
        });
        zip.saveAs(`${dir}.zip`);
        setIsWorking(false);
      })
      .catch((error) => RadGradAlert.failure('Failed to update student status', error.message));
  };
  const messageString = `Pressing the Update Student Matriculation Status button will update the students' status and download the matriculated students in a zip file.
  
        ${resultString}`;
  return (
    <Tab.Pane id={COMPONENTIDS.MATRICULATE_STUDENTS_TAB_PANE}>
      <Message info><Markdown escapeHtml source={messageString} /></Message>
      <Button onClick={() => {setOpenConfirm(true); setIsWorking(true); }} loading={isWorking} color="red">
        Update Student Matriculation Status
      </Button>
      <Confirm onConfirm={handleSubmit} onCancel={() => setOpenConfirm(false)} open={openConfirm} content="Are you sure you want to update the students status?" />
    </Tab.Pane>
  );
};

export default MatriculateStudentsTab;
