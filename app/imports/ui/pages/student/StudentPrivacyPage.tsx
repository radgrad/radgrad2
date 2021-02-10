import React from 'react';
import {Header} from 'semantic-ui-react';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'Control what others see about you';
const headerPaneBody = `
This page allows you to control what aspects of your profile are visible to other RadGrad community members.

Providing access to information about your profile allows RadGrad to help you find similarly minded community members. You can opt-in or opt-out at any time.
`;

const StudentPrivacyPage: React.FC = () => (
  <PageLayout id="student-privacy-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
    <Header>Student Privacy Page Placeholder</Header>
  </PageLayout>
);

export default StudentPrivacyPage;
