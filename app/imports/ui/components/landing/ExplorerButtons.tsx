import React from 'react';
import { Button, Dropdown } from 'semantic-ui-react';
import styles from './utilities/landing-styles';

const ExplorerButtons: React.FC = () => (
  <Button basic inverted color='yellow' size='big'  style={styles['guide-button']}>
    <Dropdown text='EXPLORER'>
      <Dropdown.Menu pointing="top right">
        <Dropdown.Item text='Career Goals' href="/#/explorer/career-goals" />
        <Dropdown.Item text='Interests' href="/#/explorer/interests" />
        <Dropdown.Item text='Courses' href="/#/explorer/courses" />
        <Dropdown.Item text='Opportunities' href="/#/explorer/opportunities" />
      </Dropdown.Menu>
    </Dropdown>
  </Button>
);

export default ExplorerButtons;
