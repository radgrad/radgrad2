import React from 'react';
import PageLayout from '../PageLayout';
import StudentSegmentExamplesPageExampleOne from './StudentSegmentExamplesPageExampleOne';

const headerPaneTitle = 'What\'s happening in RadGrad?';
const headerPaneBody = `
Here are the latest updates in RadGrad, plus overviews of the RadGrad community.
`;
const headerPaneImage = 'header-community.png';

const StudentSegmentExamplesPage: React.FC = () => (
  <PageLayout id="student-segment-examples" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>

    <StudentSegmentExamplesPageExampleOne/>

  </PageLayout>
);

export default StudentSegmentExamplesPage;
