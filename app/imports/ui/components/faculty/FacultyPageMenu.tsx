import React from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';
import { NavLink, useParams, useRouteMatch } from 'react-router-dom';
import FirstMenuContainer from '../shared/FirstMenu';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { buildRouteName } from '../shared/utilities/router';
import { EXPLORER_TYPE } from '../../layouts/utilities/route-constants';
import { AdvisorOrFacultyProfile } from '../../../typings/radgrad';

const FacultyPageMenu: React.FC = () => {
  const match = useRouteMatch();
  const { username } = useParams();
  const profile: AdvisorOrFacultyProfile = FacultyProfiles.getProfile(username);

  const menuItems = [
    { label: 'Home', route: 'home' },
    { label: 'Verification', route: 'verification-requests'},
    { label: 'Privacy', route: 'privacy'},
    { label: 'Scoreboard', route: 'scoreboard' },
    { label: 'Community', route: 'community' },
  ];

  const explorerDropdownItems = [
    { label: 'Careers', route: EXPLORER_TYPE.CAREERGOALS },
    { label: 'Courses', route: EXPLORER_TYPE.COURSES },
    { label: 'Interests', route: EXPLORER_TYPE.INTERESTS },
    { label: 'Opportunities', route: EXPLORER_TYPE.OPPORTUNITIES },
  ];

  /* In future, Faculty should be able to manage courses as well. */
  const manageDropdownItems = [
    { label: 'Opportunities', route: 'manage-opportunities' },
  ];

  const instanceName = Meteor.settings.public.instanceName;
  return (
    <div>
      <FirstMenuContainer profile={profile} displayLevelAndIce={false} instanceName={instanceName} />
      <Menu attached="top" borderless inverted stackable id="secondMenu">
        {menuItems.map((item) => (
          <Menu.Item id={`faculty-menu-${item.label.toLowerCase()}`} key={item.label} as={NavLink} exact={false} to={buildRouteName(match, `/${item.route}`)}>
            {item.label}
          </Menu.Item>
        ))}

        <Dropdown item text="Explorers">
          <Dropdown.Menu>
            {explorerDropdownItems.map((item) => (
              <Dropdown.Item id={`faculty-menu-explorer-${item.label.toLowerCase()}`} key={item.label} as={NavLink} exact to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${item.route}`)} content={item.label} />
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown item text="Manage">
          <Dropdown.Menu>
            {manageDropdownItems.map((item) => (
              <Dropdown.Item id={`faculty-menu-manage-${item.label.toLowerCase()}`} key={item.label} as={NavLink} exact to={buildRouteName(match, `/${item.route}`)} content={item.label} />
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
    </div>
  );
};

export default FacultyPageMenu;
