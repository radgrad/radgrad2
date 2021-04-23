import React from 'react';
import { Header } from 'semantic-ui-react';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'Help students make the most of RadGrad';
const headerPaneBody = `
This page contains a personalized set of recommendations to help you configure RadGrad to best support students.

<span style="color:red">The red section:</span> Please act on these right away.

<span style="color:yellow">The yellow section:</span> Requests for you to review your settings or areas of the site that might have changed recently. 

<span style="color:green">The green section:</span>  Looks good for now!
`;

const AdvisorHomePage: React.FC = () => (
  <PageLayout id={PAGEIDS.ADVISOR_HOME}headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
    <Header>Advisor Home Page Placeholder</Header>
  </PageLayout>
);

export default AdvisorHomePage;
