import React from 'react';
import { Header } from 'semantic-ui-react';
import StudentPageMenu from '../../components/student/StudentPageMenu';
import HeaderPane from '../../components/shared/HeaderPane';

const StudentVerificationPage: React.FC = () => (
  <div id="student-verification-page">
    <StudentPageMenu />
    <HeaderPane
      title="Verification Page"
      line1="To earn the points for an Opportunity, you must request verification."
      line2="This page lists all Opportunities in your Degree Plan from a previous semester. If you have completed the Opportunity, please request verification. If you didn't do it, then please go to the Degree Plan page and delete it. "
    />
    <div style={{marginRight: '10px', marginLeft: '10px'}}>
      <Header>Student Verification Page Placeholder</Header>
    </div>
  </div>
);

export default StudentVerificationPage;
