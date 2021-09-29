import React from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';
import { NavLink, useParams, useRouteMatch } from 'react-router-dom';
import { COMPONENTIDS } from '../../utilities/ComponentIDs';
import FirstMenu from '../shared/FirstMenu';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { buildRouteName } from '../shared/utilities/router';
import { AdvisorOrFacultyProfile } from '../../../typings/radgrad';
import {
  COMMUNITY,
  EXPLORER,
  HOME,
  MANAGE,
  VISIBILITY,
  FORECASTS,
} from '../../layouts/utilities/route-constants';

const FacultyPageMenu: React.FC = () => {
  const match = useRouteMatch();
  const { username } = useParams();
  const profile: AdvisorOrFacultyProfile = FacultyProfiles.getProfile(username);

  const menuItems = [
    { label: 'Home', route: HOME },
    { label: 'Visibility', route: VISIBILITY },
    { label: 'Forecasts', route: FORECASTS },
    { label: 'Community', route: COMMUNITY },
  ];

  const explorerDropdownItems = [
    { label: 'Careers', route: EXPLORER.CAREERGOALS },
    { label: 'Courses', route: EXPLORER.COURSES },
    { label: 'Interests', route: EXPLORER.INTERESTS },
    { label: 'Opportunities', route: EXPLORER.OPPORTUNITIES },
  ];
  if (Meteor.settings.public.internship.show) {
    explorerDropdownItems.push({ label: 'Internships', route: EXPLORER.INTERNSHIPS });
  }

  /* In future, Faculty should be able to manage courses as well. */
  const manageDropdownItems = [
    { label: 'Opportunities', route: MANAGE.OPPORTUNITIES },
    { label: 'Verification', route: MANAGE.VERIFICATION },
    { label: 'Review', route: MANAGE.REVIEWS },
  ];

  const instanceName = Meteor.settings.public.instanceName;
  return (
    <div>
      <FirstMenu profile={profile} displayLevelAndIce={false} instanceName={instanceName} />
      <Menu borderless inverted stackable id="secondMenu" attached="top" style={{ paddingLeft: '10px', marginTop: '0px' }}>
        {menuItems.map((item) => (
          <Menu.Item id={`faculty-menu-${item.label.toLowerCase()}`} key={item.label} as={NavLink} exact={false} to={buildRouteName(match, `/${item.route}`)}>
            {item.label}
          </Menu.Item>
        ))}

        <Dropdown item text="Explorers" id={COMPONENTIDS.FACULTY_MENU_EXPLORERS}>
          <Dropdown.Menu>
            {explorerDropdownItems.map((item) => (
              <Dropdown.Item id={`faculty-menu-explorer-${item.label.toLowerCase()}`} key={item.label} as={NavLink} exact to={buildRouteName(match, `/${item.route}`)} content={item.label} />
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown item text="Manage" id={COMPONENTIDS.FACULTY_MENU_MANAGE}>
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
