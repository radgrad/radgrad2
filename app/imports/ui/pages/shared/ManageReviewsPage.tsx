import React from 'react';
import {Header} from 'semantic-ui-react';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'Manage student-submitted reviews';
const headerPaneBody = `
Students can submit reviews of courses and opportunities. 

Faculty and advisors should check these reviews to ensure they are appropriate for public display.
`;

const ManageReviewsPage: React.FC = () => (
  <PageLayout id="manage-reviews-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
    <Header>Manage Reviews Page Placeholder</Header>
  </PageLayout>
);

export default ManageReviewsPage;
