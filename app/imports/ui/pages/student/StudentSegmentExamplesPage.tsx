import React from 'react';
import PageLayout from '../PageLayout';
import StudentSegmentExamplesPageExampleFour from './StudentSegmentExamplesPageExampleFour';
import StudentSegmentExamplesPageExampleOne from './StudentSegmentExamplesPageExampleOne';
import StudentSegmentExamplesPageExampleThree from './StudentSegmentExamplesPageExampleThree';
import StudentSegmentExamplesPageExampleTwo from './StudentSegmentExamplesPageExampleTwo';

const headerPaneTitle = 'Segment Design Examples';
const headerPaneBody = `
This page provides examples of the RadGradHeader and RadGradSegment components. 
`;
const headerPaneImage = 'header-community.png';

const StudentSegmentExamplesPage: React.FC = () => (
  <PageLayout id="student-segment-examples" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>

    <StudentSegmentExamplesPageExampleOne/>
    <StudentSegmentExamplesPageExampleTwo/>
    <StudentSegmentExamplesPageExampleThree/>
    <StudentSegmentExamplesPageExampleFour/>


  </PageLayout>
);

export default StudentSegmentExamplesPage;
