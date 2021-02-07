import React from 'react';
import {Header, Container} from 'semantic-ui-react';
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
    <Container>
      <Header>Student Home Page Placeholder</Header>
    </Container>
  </div>
);

export default StudentHomePage;
