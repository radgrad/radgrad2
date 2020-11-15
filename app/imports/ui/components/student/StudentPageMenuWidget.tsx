import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Container, Dropdown, Menu } from 'semantic-ui-react';
import FirstMenuContainer from '../../pages/shared/FirstMenu';
import { secondMenu } from '../shared/shared-widget-names';
import { buildRouteName, getUsername, IMatchProps } from '../shared/router-helper-functions';
import { COMMUNITY, DEGREEPLANNER, EXPLORER_TYPE } from '../../../startup/client/route-constants';
import { IStudentProfile } from '../../../typings/radgrad';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';

interface IStudentPageMenuWidgetProps {
  match: IMatchProps;
}

const explorerDropdownItems = [
  { key: 'Academic Plans', route: EXPLORER_TYPE.ACADEMICPLANS, id: 'student-menu-academic-plans' },
  { key: 'Career Goals', route: EXPLORER_TYPE.CAREERGOALS, id: 'student-menu-career-goals' },
  { key: 'Courses', route: EXPLORER_TYPE.COURSES, id: 'student-menu-courses' },
  { key: 'Interests', route: EXPLORER_TYPE.INTERESTS, id: 'student-menu-interests' },
];

const studentHomePageItems = [
  { key: 'About Me', route: 'aboutme', id: 'student-menu-about-me' },
  { key: 'ICE Points', route: 'ice', id: 'student-menu-ice-points' },
  { key: 'Levels', route: 'levels', id: 'student-menu-levels' },
  { key: 'Advisor Log', route: 'log', id: 'student-menu-advisor-log' },
];

const communityDropdownItems = [
  { key: 'Users', route: COMMUNITY.USERS, id: 'student-menu-users' },
  { key: 'RadGrad Videos', route: COMMUNITY.RADGRADVIDEOS, id: 'student-menu-radgrad-videos' },
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
            <Dropdown item text="EXPLORE" id="student-menu-explore">
              <Dropdown.Menu>
                {explorerDropdownItems.map((item) => (
                  <Dropdown.Item
                    key={item.key}
                    id={item.id}
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
              id="student-menu-opportunities"
              exact
              to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}`)}
            >
              OPPORTUNITIES
            </Menu.Item>
            <Menu.Item id="student-menu-degree-planner" as={NavLink} exact to={buildRouteName(match, `/${DEGREEPLANNER}`)}>
              DEGREE PLANNER
            </Menu.Item>
            <Dropdown item id="student-menu-community" text="COMMUNITY">
              <Dropdown.Menu>
                {communityDropdownItems.map((item) => (
                  <Dropdown.Item
                    key={item.key}
                    id={item.id}
                    as={NavLink}
                    exact
                    to={buildRouteName(match, `/${COMMUNITY.HOME}/${item.route}`)}
                    content={item.key}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Menu position="right">
              <Dropdown id="dropdown-user-fullname" item text={`Aloha, ${profile.firstName} ${profile.lastName}!`}>
                <Dropdown.Menu>
                  {studentHomePageItems.map((item) => (
                    <Dropdown.Item
                      key={item.key}
                      id={item.id}
                      as={NavLink}
                      exact
                      to={buildRouteName(match, `/home/${item.route}`)}
                      content={item.key}
                    />
                  ))}
                  <Dropdown.Item id="student-menu-signout" as={NavLink} exact to="/signout" content="Sign Out" />
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
