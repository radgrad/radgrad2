import React from 'react';
import { Header } from 'semantic-ui-react';
import StudentPageMenu from '../../components/student/StudentPageMenu';
import HeaderPane from '../../components/shared/HeaderPane';

const headerPaneTitle = 'Control what others see about you';
const headerPaneBody = `
This page allows you to control what aspects of your profile are visible to other RadGrad community members.

Providing access to information about your profile allows RadGrad to help you find similarly minded community members. You can opt-in or opt-out at any time.
`;

const StudentPrivacyPage: React.FC = () => (
  <div id="student-privacy-page">
    <StudentPageMenu />
    <HeaderPane title={headerPaneTitle} body={headerPaneBody}/>
    <div style={{marginRight: '10px', marginLeft: '10px'}}>
      <Header>Student Privacy Page Placeholder</Header>
    </div>
  </div>
);

export default StudentPrivacyPage;
