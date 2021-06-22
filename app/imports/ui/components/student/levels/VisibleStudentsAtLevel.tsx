import React from 'react';
import { Header } from 'semantic-ui-react';
import { StudentProfile } from '../../../../typings/radgrad';
import UserLabel from '../../shared/profile/UserLabel';

interface VisibleStudentsAtLevelProps {
  students: StudentProfile[];
  level: number;
}

const VisibleStudentsAtLevel: React.FC<VisibleStudentsAtLevelProps> = ({ students, level }) => (
  <div>
    <Header as="h4" dividing>
      (VISIBLE) LEVEL {level} STUDENTS
    </Header>
    {students.length > 0 ?
      students.map((student) => <UserLabel key={student.username} username={student.username} />) :
      <i>No students at this level.</i>
    }
  </div>
);

export default VisibleStudentsAtLevel;
