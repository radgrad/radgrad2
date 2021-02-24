import React from 'react';
import { Header } from 'semantic-ui-react';
import PageLayout from '../PageLayout';
import getTermsAndConditions from '../../../api/utilities/TermsAndConditions.methods';

const headerPaneTitle = 'Terms and Conditions to Join RadGrad';
const headerPaneBody = `
Knowing what the terms and conditions for joining RadGrad.
 
Your first name, last name, and email address are visible to other students, faculty, and advisors. 
`;

const StudentTermsAndConditionsPage: React.FC = () => {
  const markdown = await getTermsAndConditions.call();
  return (
    <PageLayout id="student-terms-and-conditions-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
      <Header>Student Terms and Conditions Page Placeholder</Header>
    </PageLayout>
  );
}

export default StudentTermsAndConditionsPage;
