import React from 'react';
import { Button, Dropdown } from 'semantic-ui-react';

const ExplorerButtons: React.FC = () => (
  <Button inverted id='landing-explorer-buttons'>
    <Dropdown text='EXPLORER'>
      <Dropdown.Menu pointing="top right">
        <Dropdown.Item id='landing-career-goals-explorer' text='Career Goals' href="/#/explorer/career-goals" />
        <Dropdown.Item id='landing-interests-explorer' text='Interests' href="/#/explorer/interests" />
        <Dropdown.Item id='landing-courses-explorer' text='Courses' href="/#/explorer/courses" />
        <Dropdown.Item id='landing-opportunities-explorer' text='Opportunities' href="/#/explorer/opportunities" />
      </Dropdown.Menu>
    </Dropdown>
  </Button>
);

export default ExplorerButtons;
