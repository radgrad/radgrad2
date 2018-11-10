import * as React from 'react';
import { Button, Card, Dropdown, Header, Icon, Segment } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { getRouteName } from './helper-functions';

const LandingExplorerMenu = (props) => {
  // console.log(props);
  const fullPath =  `#${props.match.path}`;
  const pathBack = fullPath.substring(0, fullPath.lastIndexOf('/'));
  return (
    <div>
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
      {_.isEmpty(props.match.params) ? '' :
        <a className="ui button" href={pathBack}><Icon name="chevron circle left"/><br/>Back
          to {getRouteName(props.location.pathname)}</a>}
    </div>
  );
};

const LandingExplorerMenuContainer = withRouter(LandingExplorerMenu);
export default LandingExplorerMenuContainer;
