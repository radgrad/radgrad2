import React from 'react';
import { Button, Dropdown } from 'semantic-ui-react';
import { COMPONENTIDS } from '../../utilities/ComponentIDs';

const UserGuideButtons: React.FC = () => (
  <Button inverted>
    <Dropdown id="GUIDE" text="USER GUIDE FOR" pointing="top right">
      <Dropdown.Menu>
        <Dropdown.Item id={COMPONENTIDS.STUDENT} text='Students' target="_blank" href='https://www.radgrad.org/docs/users/students/overview'/>
        <Dropdown.Item id={COMPONENTIDS.FACULTY} text='Faculty' target="_blank" href='https://www.radgrad.org/docs/users/faculty/overview'/>
        <Dropdown.Item id={COMPONENTIDS.ADVISOR} text='Advisors' target="_blank" href='https://www.radgrad.org/docs/users/advisors/overview'/>
      </Dropdown.Menu>
    </Dropdown>
  </Button>
);

export default UserGuideButtons;
