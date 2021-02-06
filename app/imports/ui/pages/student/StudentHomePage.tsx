import React from 'react';
import {Header, Container} from 'semantic-ui-react';
import StudentPageMenu from '../../components/student/StudentPageMenu';

const StudentHomePage: React.FC = () => (
  <div id="student-home-page">
    <StudentPageMenu/>
    <Container>
      <Header>Student Home Page Placeholder</Header>
    </Container>
  </div>
);

export default StudentHomePage;
