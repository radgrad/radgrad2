import React from 'react';
import { Header } from 'semantic-ui-react';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'Verify that you completed your opportunities';
const headerPaneBody = `
To earn the Innovation and/or Experience points for an Opportunity, you must request verification.

This page lists all Opportunities in your Degree Plan from a previous semester. If you have completed the Opportunity, please request verification. 

If you didn't do it, then please go to the Degree Plan page and delete it.  
`;
const headerPaneImage = 'header-verification.png';

const StudentVerificationPage: React.FC = () => (
  <PageLayout id="student-verification-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <Header>Student Verification Page Placeholder</Header>
  </PageLayout>
);

export default StudentVerificationPage;
