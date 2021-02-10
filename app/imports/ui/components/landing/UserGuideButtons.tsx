import React from 'react';
import { Button, Dropdown } from 'semantic-ui-react';

const UserGuideButtons: React.FC = () => (
  <Button size="massive">
    <Dropdown id="GUIDE" text="USER GUIDE FOR" pointing="top right">
      <Dropdown.Menu>
        <a href="https://www.radgrad.org/docs/users/students/overview"><Dropdown.Item id="student" />Students</a>
        <a href="https://www.radgrad.org/docs/users/faculty/overview"><Dropdown.Item id="faculty" />Faculty</a>
        <a href="https://www.radgrad.org/docs/users/advisors/overview"><Dropdown.Item id="advisor" />Advisors</a>
      </Dropdown.Menu>
    </Dropdown>
  </Button>
);

export default UserGuideButtons;
