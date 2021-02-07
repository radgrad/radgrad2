import React from 'react';
import {Header} from 'semantic-ui-react';
import StudentPageMenu from '../../components/student/StudentPageMenu';
import HeaderPane from '../../components/shared/HeaderPane';

const StudentHomePage: React.FC = () => (
  <div id="student-home-page">
    <StudentPageMenu/>
    <HeaderPane
      title="Home Page"
      line1="Your home page provides a custom checklist that helps you make the most of RadGrad ."
      line2="Try to take care of any items with the 'Improve' label right away."
    />
    <div style={{marginRight: '10px', marginLeft: '10px'}}>
      <Header>Student Home Page Placeholder</Header>
    </div>
  </div>
);

export default StudentHomePage;
