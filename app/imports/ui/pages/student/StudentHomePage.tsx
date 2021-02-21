import React from 'react';
import {Header} from 'semantic-ui-react';
import PageLayout from '../PageLayout';

const headerPaneImage = '/images/header-img/header-interests.png';
const headerPaneTitle = 'Make the most of <span style="color:#6FBE44">RADGRAD</span>';
const headerPaneBody = `
This page contains a personalized set of recommendations to help RadGrad help you! It's divided into three sections. Not all of them might be present at any particular time.<br/>
<span style="color:red">The red section:</span> Please act on these right away. They really help RadGrad help you. <br/>
<span style="color:yellow">The yellow section:</span> Requests for you to review your settings or areas of the site that might have changed recently. <br/>
<span style="color:green">The green section:</span>  Looks good for now!
`;

const StudentHomePage: React.FC = () => (
  <PageLayout id="student-home-page" headerPaneImage={headerPaneImage} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
    <Header>Student Home Page Placeholder</Header>
  </PageLayout>
);

export default StudentHomePage;
