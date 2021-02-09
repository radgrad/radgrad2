import React from 'react';
import { Button, Dropdown } from 'semantic-ui-react';

interface UserGuideButtonsProps {
  userGuideURL: string;
}

const UserGuideButtons: React.FC<UserGuideButtonsProps> = ({ userGuideURL }) => (
  <Button size="massive">
    <Dropdown id="GUIDE" text="USER GUIDE FOR" pointing="top right">
      <Dropdown.Menu>
        <a href={`${userGuideURL}students/overview`}><Dropdown.Item id="student" />Students</a>
        <a href={`${userGuideURL}faculty/overview`}><Dropdown.Item id="faculty" />Faculty</a>
        <a href={`${userGuideURL}advisors/overview`}><Dropdown.Item id="advisor" />Advisors</a>
      </Dropdown.Menu>
    </Dropdown>
  </Button>
);

export default UserGuideButtons;
