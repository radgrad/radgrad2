import React from 'react';
import { Header } from 'semantic-ui-react';
import StudentPageMenu from '../../components/student/StudentPageMenu';
import HeaderPane from '../../components/shared/HeaderPane';

const StudentReviewsPage: React.FC = () => (
  <div id="student-reviews-page">
    <StudentPageMenu />
    <HeaderPane
      title="Reviews Page"
      line1="Providing reviews is an important way for you to pay it forward in RadGrad."
      line2="Use this page to write reviews for any Courses and Opportunities you've completed."
    />
    <div style={{marginRight: '10px', marginLeft: '10px'}}>
      <Header>Student Reviews Page Placeholder</Header>
    </div>
  </div>
);

export default StudentReviewsPage;
