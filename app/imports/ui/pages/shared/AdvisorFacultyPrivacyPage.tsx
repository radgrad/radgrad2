import React from 'react';
import { Header } from 'semantic-ui-react';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'Specify your profile visibility';
const headerPaneBody = `
This page allows you to set your profile information and make it available to RadGrad community members.  

As a faculty member or advisor, it is useful to both fill out your profile and make it available. This makes it easier for students with similar interests to find you. 
`;

const AdvisorFacultyPrivacyPage: React.FC = () => (
 <PageLayout id="advisor-faculty-privacy-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
   <Header>Advisor/Faculty Privacy Page Placeholder</Header>
 </PageLayout>
);

export default AdvisorFacultyPrivacyPage;
