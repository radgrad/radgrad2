import React from 'react';
import { Header } from 'semantic-ui-react';
import StudentPageMenu from '../../components/student/StudentPageMenu';
import HeaderPane from '../../components/shared/HeaderPane';

const headerPaneTitle = 'Pay it forward with reviews';
const headerPaneBody = `
Providing reviews helps future students make the most of their courses and opportunities.

And, providing reviews is important to reaching higher Levels in RadGrad. 
`;
const StudentReviewsPage: React.FC = () => (
  <div id="student-reviews-page">
    <StudentPageMenu />
    <HeaderPane title={headerPaneTitle} body={headerPaneBody}/>
    <div style={{marginRight: '10px', marginLeft: '10px'}}>
      <Header>Student Reviews Page Placeholder</Header>
    </div>
  </div>
);

export default StudentReviewsPage;
