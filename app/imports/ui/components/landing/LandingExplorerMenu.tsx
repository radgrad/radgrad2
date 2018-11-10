import * as React from 'react';
import { Button, Card, Dropdown, Header, Segment } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import { getRouteName } from './helper-functions';

const LandingExplorerMenu = (props) => {
  console.log(props);
  return (
    <Segment padded={true}>
      <Header as="h4" dividing={true}>Select Explorer</Header>
      <Dropdown text={getRouteName(props.location.pathname)}>
        <Dropdown.Menu>
          <Dropdown.Item as={NavLink} to="/explorer/academic-plans">Academic Plans</Dropdown.Item>
          <Dropdown.Item as={NavLink} to="/explorer/career-goals">Career Goals</Dropdown.Item>
          <Dropdown.Item as={NavLink} to="/explorer/courses">Courses</Dropdown.Item>
          <Dropdown.Item as={NavLink} to="/explorer/degrees">Degrees</Dropdown.Item>
          <Dropdown.Item as={NavLink} to="/explorer/interests">Interests</Dropdown.Item>
          <Dropdown.Item as={NavLink} to="/explorer/opportunities">Opportunities</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Segment>
  );
};

const LandingExplorerMenuContainer = withRouter(LandingExplorerMenu);
export default LandingExplorerMenuContainer;
