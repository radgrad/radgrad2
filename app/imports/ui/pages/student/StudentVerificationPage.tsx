import React from 'react';
import { Header } from 'semantic-ui-react';
import StudentPageMenu from '../../components/student/StudentPageMenu';
import HeaderPane from '../../components/shared/HeaderPane';

const headerPaneTitle = 'Verify that you completed your opportunities';
const headerPaneBody = `
To earn the Innovation and/or Experience points for an Opportunity, you must request verification.

This page lists all Opportunities in your Degree Plan from a previous semester. If you have completed the Opportunity, please request verification. 

If you didn't do it, then please go to the Degree Plan page and delete it.  
`;

const StudentVerificationPage: React.FC = () => (
  <div id="student-verification-page">
    <StudentPageMenu />
    <HeaderPane title={headerPaneTitle} body={headerPaneBody}/>
    <div style={{marginRight: '10px', marginLeft: '10px'}}>
      <Header>Student Verification Page Placeholder</Header>
    </div>
  </div>
);

export default StudentVerificationPage;
