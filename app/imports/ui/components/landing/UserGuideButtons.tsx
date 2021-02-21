import React from 'react';
import { Button, Dropdown } from 'semantic-ui-react';
import styles from './utilities/landing-styles';

const UserGuideButtons: React.FC = () => (
  <Button basic inverted color='yellow' size='big' style={styles['guide-button']}>
    <Dropdown id="GUIDE" text="USER GUIDE FOR" pointing="top right">
      <Dropdown.Menu>
        <Dropdown.Item id="student" text='Students' target="_blacnk" href='https://www.radgrad.org/docs/users/students/overview'/>
        <Dropdown.Item id="faculty" text='Faculty' target="_blacnk" href='https://www.radgrad.org/docs/users/faculty/overview'/>
        <Dropdown.Item id="advisors" text='Advisors' target="_blacnk" href='https://www.radgrad.org/docs/users/advisors/overview'/>
      </Dropdown.Menu>
    </Dropdown>
  </Button>
);

export default UserGuideButtons;
