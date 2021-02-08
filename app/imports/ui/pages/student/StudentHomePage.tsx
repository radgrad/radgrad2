import React from 'react';
import {Header} from 'semantic-ui-react';
import StudentPageMenu from '../../components/student/StudentPageMenu';
import HeaderPane from '../../components/shared/HeaderPane';

const headerPaneTitle = 'Make the most of RadGrad';
const headerPaneBody = `
This page contains a personalized set of recommendations to help RadGrad help you!

  * If you have **improve** recommendations, please do those right away. They make a big difference. 
  * Periodically RadGrad will ask you to **review** pages or settings to make sure you are up to date.
  * The **awesome** section just records what you've already done.
`;

const StudentHomePage: React.FC = () => (
  <div id="student-home-page">
    <StudentPageMenu/>
    <HeaderPane title={headerPaneTitle} body={headerPaneBody}/>
    <div style={{marginRight: '10px', marginLeft: '10px'}}>
      <Header>Student Home Page Placeholder</Header>
    </div>
  </div>
);

export default StudentHomePage;
