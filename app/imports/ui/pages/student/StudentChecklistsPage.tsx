import React from 'react';
// import { withTracker } from 'meteor/react-meteor-data';
import StudentPageMenu from '../../components/student/StudentPageMenu';

const StudentChecklistsPage: React.FC = () => {
  console.log('StudentChecklistsPage');
  return (
    <div id="student-checklists-page">
      <StudentPageMenu />
    </div>
  );
};

export default StudentChecklistsPage;
