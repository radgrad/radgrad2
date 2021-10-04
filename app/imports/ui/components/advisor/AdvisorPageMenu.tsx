import React from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';
import { NavLink, useParams, useRouteMatch } from 'react-router-dom';
import { COMPONENTIDS } from '../../utilities/ComponentIDs';
import FirstMenu from '../shared/FirstMenu';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { buildRouteName } from '../shared/utilities/router';
import { AdvisorOrFacultyProfile } from '../../../typings/radgrad';
import {
  HOME,
  MANAGE,
  VISIBILITY,
  FORECASTS,
  COMMUNITY,
  EXPLORER,
} from '../../layouts/utilities/route-constants';

// TODO: Advisor menu and Faculty menu currently differ by only one item: Manage Students page.
// Consider combining into a single component?

const AdvisorPageMenu: React.FC = () => {
  const match = useRouteMatch();
  const { username } = useParams();
  const profile: AdvisorOrFacultyProfile = AdvisorProfiles.getProfile(username);

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

  /* In future, Advisors should be able to manage courses as well. */
  const manageDropdownItems = [
    { label: 'Students', route: MANAGE.STUDENTS },
    { label: 'Verification', route: MANAGE.VERIFICATION },
    { label: 'Review', route: MANAGE.REVIEWS },
    { label: 'Opportunities', route: MANAGE.OPPORTUNITIES },
  ];

  const instanceName = Meteor.settings.public.instanceName;
  return (
    <div>
      <FirstMenu profile={profile} displayLevelAndIce={false} instanceName={instanceName} />
      <Menu borderless inverted stackable id="secondMenu" attached="top" style={{ paddingLeft: '10px', marginTop: '0px' }}>
        {menuItems.map((item) => (
          <Menu.Item id={`advisor-menu-${item.label.toLowerCase()}`} key={item.label} as={NavLink} exact={false} to={buildRouteName(match, `/${item.route}`)}>
            {item.label}
          </Menu.Item>
        ))}

        <Dropdown item text="Explorers" id={COMPONENTIDS.ADVISOR_MENU_EXPLORERS}>
          <Dropdown.Menu>
            {explorerDropdownItems.map((item) => (
              <Dropdown.Item id={`advisor-menu-explorer-${item.label.toLowerCase()}`} key={item.label} as={NavLink} exact to={buildRouteName(match, `/${item.route}`)} content={item.label} />
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown item text="Manage" id={COMPONENTIDS.ADVISOR_MENU_MANAGE}>
          <Dropdown.Menu>
            {manageDropdownItems.map((item) => (
              <Dropdown.Item id={`advisor-menu-manage-${item.label.toLowerCase()}`} key={item.label} as={NavLink} exact to={buildRouteName(match, `/${item.route}`)} content={item.label} />
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
    </div>
  );
};

export default AdvisorPageMenu;
