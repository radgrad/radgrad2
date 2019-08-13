import * as React from 'react';
import { Dropdown, Header, Icon, Segment } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { getRouteName } from './helper-functions';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';

const LandingExplorerMenu = (props: { match: { path: string; params: string;}, location: { pathname: string;}}) => {
  // console.log(props);
  const fullPath = `#${props.match.path}`;
  const pathBack = fullPath.substring(0, fullPath.lastIndexOf('/'));
  return (
    <div>
      <Segment padded={true}>
        <Header as="h4" dividing={true}>Select Explorer</Header>
        <Dropdown text={getRouteName(props.location.pathname)}>
          <Dropdown.Menu>
            <Dropdown.Item as={NavLink} to={`/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}`}>Academic
              Plans</Dropdown.Item>
            <Dropdown.Item as={NavLink} to={`/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}`}>Career
              Goals</Dropdown.Item>
            <Dropdown.Item as={NavLink} to={`/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}`}>Courses</Dropdown.Item>
            <Dropdown.Item as={NavLink} to={`/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.DEGREES}`}>Degrees</Dropdown.Item>
            <Dropdown.Item as={NavLink}
                           to={`/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}`}>Interests</Dropdown.Item>
            <Dropdown.Item as={NavLink}
                           to={`/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}`}>Opportunities</Dropdown.Item>
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
