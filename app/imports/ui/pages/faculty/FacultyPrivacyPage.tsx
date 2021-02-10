import React from 'react';
import { Header } from 'semantic-ui-react';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'Specify your profile visibility to RadGrad community members';
const headerPaneBody = `
This page allows you to set your profile information and make it available to RadGrad community members.  

As a faculty member, it is useful to both fill out your profile and make it available. This makes it easier for students with similar interests to find you. 
`;

const FacultyPrivacyPage: React.FC = () => (
 <PageLayout id="faculty-privacy-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
   <Header>Faculty Privacy Page Placeholder</Header>
 </PageLayout>
);

export default FacultyPrivacyPage;
