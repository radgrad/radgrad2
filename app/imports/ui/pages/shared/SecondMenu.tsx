import React from 'react';
import { Menu, SemanticWIDTHS, Dropdown, Container } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import { secondMenu } from '../../components/shared/shared-widget-names';
import styles from '../../../../client/style';
import { buildRouteName, getUsername } from '../../components/shared/RouterHelperFunctions';
import { EXPLORER_TYPE, DEGREEPLANNER } from '../../../startup/client/route-constants';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { IStudentProfile } from '../../../typings/radgrad';

interface IMenuItem {
  label: string;
  regex: string;
  route: string;
}

interface ISecondMenuProps {
  menuItems: IMenuItem[];
  numItems: SemanticWIDTHS;
  currentUser: string;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const explorerDropdownItems = [
  { key: 'Academic Plans', route: EXPLORER_TYPE.ACADEMICPLANS },
  { key: 'Career Goals', route: EXPLORER_TYPE.CAREERGOALS },
  { key: 'Courses', route: EXPLORER_TYPE.COURSES },
  { key: 'Degrees', route: EXPLORER_TYPE.DEGREES },
  { key: 'Interests', route: EXPLORER_TYPE.INTERESTS },
  { key: 'Opportunities', route: EXPLORER_TYPE.OPPORTUNITIES },
  { key: 'Users', route: EXPLORER_TYPE.USERS },
];

const studentHomePageItems = [
  { key: 'Home', route: '' },
  { key: 'About Me', route: 'aboutme' },
  { key: 'ICE Points', route: 'ice' },
  { key: 'Levels', route: 'levels' },
  { key: 'Advisor Log', route: 'log' },
];

const SecondMenu = (props: ISecondMenuProps) => {
  const { match } = props;
  const username = getUsername(match);
  const profile: IStudentProfile = StudentProfiles.getProfile(username);
  return (
    <div style={styles['radgrad-student-menu']}>
      <Container>
        <Menu
          attached="top"
          borderless
          widths={props.numItems}
          secondary
          pointing
          id={`${secondMenu}`}
          style={styles['radgrad-student-menu']}
        >
          <Menu.Item as={NavLink} exact to="/">
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
              <Dropdown.Item>Mentors</Dropdown.Item>
              <Dropdown.Item>Automotive</Dropdown.Item>
              <Dropdown.Item>Home</Dropdown.Item>
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
  );
};

export default withRouter(SecondMenu);
