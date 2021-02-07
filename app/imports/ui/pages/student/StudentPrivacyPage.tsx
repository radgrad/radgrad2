import React from 'react';
import { Header } from 'semantic-ui-react';
import StudentPageMenu from '../../components/student/StudentPageMenu';
import HeaderPane from '../../components/shared/HeaderPane';

const StudentPrivacyPage: React.FC = () => (
  <div id="student-privacy-page">
    <StudentPageMenu />
    <HeaderPane
      title="Privacy Page"
      line1="You can control what other RadGrad community members can see about you."
      line2="Providing access to information about your profile allows RadGrad to help you find similarly minded community members. You can opt-in or opt-out at any time. "
    />
    <div style={{marginRight: '10px', marginLeft: '10px'}}>
      <Header>Student Privacy Page Placeholder</Header>
    </div>
  </div>
);

export default StudentPrivacyPage;
