import React from 'react';
import { Button, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import styles from './utilities/landing-styles';

interface LoginButtonsProps {
  instanceName: string;
}
const LoginButtons: React.FC<LoginButtonsProps> = ({ instanceName }) => (
  <Button basic inverted color='yellow' size='big'  style={styles['guide-button']}>
    <Dropdown id="LOGIN" text={`${instanceName  } LOGIN FOR`} pointing="top right">
      <Dropdown.Menu>
        <Dropdown.Item id="student" text='Student' as={Link} to="/signin" />
        <Dropdown.Item id="faculty" text='Faculty' as={Link} to="/signin" />
        <Dropdown.Item id="advisor" text='Advisor' as={Link} to="/signin" />
        <Dropdown.Item id="admin" text='Admin' as={Link} to="/signin" />
      </Dropdown.Menu>
    </Dropdown>
  </Button>
);

export default LoginButtons;
