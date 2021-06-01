import React from 'react';
import { Button, Dropdown } from 'semantic-ui-react';
import { COMPONENTIDS } from '../../utilities/ComponentIDs';

const ExplorerButtons: React.FC = () => (
  <Button inverted id={COMPONENTIDS.LANDING_EXPLORER_BUTTONS}>
    <Dropdown text='EXPLORER'>
      <Dropdown.Menu pointing="top right">
        <Dropdown.Item id={COMPONENTIDS.LANDING_CAREER_GOALS_EXPLORER} text='Career Goals' href="/#/explorer/career-goals" />
        <Dropdown.Item id={COMPONENTIDS.LANDING_INTERESTS_EXPLORER} text='Interests' href="/#/explorer/interests" />
        <Dropdown.Item id={COMPONENTIDS.LANDING_COURSES_EXPLORER} text='Courses' href="/#/explorer/courses" />
        <Dropdown.Item id={COMPONENTIDS.LANDING_OPPORTUNITIES_EXPLORER} text='Opportunities' href="/#/explorer/opportunities" />
      </Dropdown.Menu>
    </Dropdown>
  </Button>
);

export default ExplorerButtons;
