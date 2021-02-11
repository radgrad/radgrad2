import React from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';
import { NavLink, useParams, useRouteMatch } from 'react-router-dom';
import FirstMenu from '../shared/FirstMenu';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { buildRouteName } from '../shared/utilities/router';
import { EXPLORER_TYPE } from '../../layouts/utilities/route-constants';
import { AdvisorOrFacultyProfile } from '../../../typings/radgrad';

// TODO: Advisor menu and Faculty menu currently differ by only one item: Manage Students page.
// Consider combining into a single component?

const AdvisorPageMenu: React.FC = () => {
  const match = useRouteMatch();
  const { username } = useParams();
  const profile: AdvisorOrFacultyProfile = AdvisorProfiles.getProfile(username);

  const menuItems = [
    { label: 'Home', route: 'home' },
    { label: 'Students', route: 'manage-students' },
    { label: 'Verification', route: 'manage-verifications'},
    { label: 'Review', route: 'review-moderation'},
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

  /* In future, Advisors should be able to manage courses as well. */
  const manageDropdownItems = [
    { label: 'Opportunities', route: 'manage-opportunities' },
  ];

  const instanceName = Meteor.settings.public.instanceName;
  return (
    <div>
      <FirstMenu profile={profile} displayLevelAndIce={false} instanceName={instanceName} />
      <Menu borderless inverted stackable id="secondMenu" attached="top" style={{paddingLeft: '10px', marginTop: '0px'}}>
        {menuItems.map((item) => (
          <Menu.Item id={`advisor-menu-${item.label.toLowerCase()}`} key={item.label} as={NavLink} exact={false} to={buildRouteName(match, `/${item.route}`)}>
            {item.label}
          </Menu.Item>
        ))}

        <Dropdown item text="Explorers" id="advisor-menu-explorers">
          <Dropdown.Menu>
            {explorerDropdownItems.map((item) => (
              <Dropdown.Item id={`advisor-menu-explorer-${item.label.toLowerCase()}`} key={item.label} as={NavLink} exact to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${item.route}`)} content={item.label} />
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown item text="Manage" id="advisor-menu-manage">
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
