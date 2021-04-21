import React from 'react';
import { Header } from 'semantic-ui-react';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import { COLORS } from '../../utilities/Colors';

const headerPaneTitle = 'Help students make the most of RadGrad';
const headerPaneBody = `
This page contains a personalized set of recommendations to help you configure RadGrad to best support students.

<span style="color:${COLORS.RED}">The red section:</span> Please act on these right away.

<span style="color:${COLORS.YELLOW}">The yellow section:</span> Requests for you to review your settings or areas of the site that might have changed recently. 

<span style="color:${COLORS.GREEN}">The green section:</span>  Looks good for now!

For more information, please see the [Admin User Guide](https://www.radgrad.org/docs/users/admins/overview/).
`;

const AdminHomePage: React.FC = () => (
  <PageLayout id={PAGEIDS.ADMIN_HOME} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
    <Header>Admin Home Page Placeholder</Header>
  </PageLayout>
);

export default AdminHomePage;
