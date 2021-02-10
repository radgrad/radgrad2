import React from 'react';
import {Header} from 'semantic-ui-react';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'Moderate student-submitted reviews';
const headerPaneBody = `
Students can submit reviews of courses and opportunities. 

Faculty and advisors should check these reviews to ensure they are appropriate for public display.
`;

const ReviewModerationPage: React.FC = () => (
  <PageLayout id="review-moderation-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
    <Header>Review Moderation Page Placeholder</Header>
  </PageLayout>
);

export default ReviewModerationPage;
