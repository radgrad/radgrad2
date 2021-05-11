import React from 'react';
import { Tab } from 'semantic-ui-react';
import { StudentProfile } from '../../../../typings/radgrad';

interface MatriculateStudentsTabProps {
  students: StudentProfile[];
  alumni: StudentProfile[];
}

const MatriculateStudentsTab: React.FC<MatriculateStudentsTabProps> = ({ students, alumni }) => {
  const retiredStudents = students.filter((s) => s.retired);
  const retiredAlumni = alumni.filter((a) => a.retired);
  const retired = retiredAlumni.concat(retiredStudents);
  return (
    <Tab.Pane>
      {retired.map((r) => (<p>{r.username}</p>))}
    </Tab.Pane>
  );
};

export default MatriculateStudentsTab;
