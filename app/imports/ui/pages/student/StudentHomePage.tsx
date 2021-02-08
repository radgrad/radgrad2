import React from 'react';
import {Header} from 'semantic-ui-react';
import StudentPageMenu from '../../components/student/StudentPageMenu';
import HeaderPane from '../../components/shared/HeaderPane';

const headerPaneTitle = 'Make the most of RadGrad';
const headerPaneBody = `
This page contains a personalized set of recommendations to help RadGrad help you!

  * Please act on suggestions in the <span style="color:red">red section</span> right away. They really help RadGrad help you. 
  * Suggestions in the <span style="color:yellow">yellow section</span> are requests for you to review your settings or areas of the site that might have changed recently. 
  * The <span style="color:green">green section</span> lists everything that looks good for now!
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
