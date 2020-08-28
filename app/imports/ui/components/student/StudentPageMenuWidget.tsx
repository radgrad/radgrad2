import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Container, Dropdown, Menu } from 'semantic-ui-react';
import FirstMenuContainer from '../../pages/shared/FirstMenu';
import { secondMenu } from '../shared/shared-widget-names';
import { buildRouteName, getUsername, IMatchProps } from '../shared/RouterHelperFunctions';
import { COMMUNITY, DEGREEPLANNER, EXPLORER_TYPE } from '../../../startup/client/route-constants';
import { IStudentProfile } from '../../../typings/radgrad';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';

interface IStudentPageMenuWidgetProps {
  match: IMatchProps;
}

const explorerDropdownItems = [
  { key: 'Academic Plans', route: EXPLORER_TYPE.ACADEMICPLANS },
  { key: 'Career Goals', route: EXPLORER_TYPE.CAREERGOALS },
  { key: 'Courses', route: EXPLORER_TYPE.COURSES },
  { key: 'Interests', route: EXPLORER_TYPE.INTERESTS },
];

const studentHomePageItems = [
  { key: 'About Me', route: 'aboutme' },
  { key: 'ICE Points', route: 'ice' },
  { key: 'Levels', route: 'levels' },
  { key: 'Advisor Log', route: 'log' },
];

const communityDropdownItems = [
  { key: 'Users', route: COMMUNITY.USERS },
  { key: 'RadGrad Videos', route: COMMUNITY.RADGRADVIDEOS },
];

const StudentPageMenuWidget = (props: IStudentPageMenuWidgetProps) => {
  const { match } = props;
  const username = getUsername(match);
  const divStyle = { marginBottom: 30 };
  const profile: IStudentProfile = StudentProfiles.getProfile(username);

  return (
    <div style={divStyle}>
      <FirstMenuContainer />
      <div className="radgrad-menu" id="menu">
        <Container>
          <Menu
            attached="top"
            borderless
            secondary
            inverted
            pointing
            id={`${secondMenu}`}
          >
            <Menu.Item as={NavLink} exact to={`/student/${username}/home`}>
              Home
            </Menu.Item>
            <Dropdown item text="EXPLORE">
              <Dropdown.Menu>
                {explorerDropdownItems.map((item) => (
                  <Dropdown.Item
                    key={item.key}
                    as={NavLink}
                    exact
                    to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${item.route}`)}
                    content={item.key}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item
              as={NavLink}
              exact
              to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}`)}
            >
              OPPORTUNITIES
            </Menu.Item>
            <Menu.Item as={NavLink} exact to={buildRouteName(match, `/${DEGREEPLANNER}`)}>
              DEGREE PLANNER
            </Menu.Item>
            <Dropdown item text="COMMUNITY">
              <Dropdown.Menu>
                {communityDropdownItems.map((item) => (
                  <Dropdown.Item
                    key={item.key}
                    as={NavLink}
                    exact
                    to={buildRouteName(match, `/${COMMUNITY.HOME}/${item.route}`)}
                    content={item.key}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Menu position="right">
              <Dropdown item text={`Aloha, ${profile.firstName} ${profile.lastName}!`}>
                <Dropdown.Menu>
                  {studentHomePageItems.map((item) => (
                    <Dropdown.Item
                      key={item.key}
                      as={NavLink}
                      exact
                      to={buildRouteName(match, `/home/${item.route}`)}
                      content={item.key}
                    />
                  ))}
                  <Dropdown.Item as={NavLink} exact to="/signout" content="Sign Out" />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          </Menu>
        </Container>
      </div>
    </div>
  );
};

export default withRouter(StudentPageMenuWidget);
