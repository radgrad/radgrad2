import React from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';
import { NavLink, useParams, useRouteMatch } from 'react-router-dom';
import { COMPONENTIDS } from '../../utilities/ComponentIDs';
import FirstMenu from '../shared/FirstMenu';
import { buildRouteName } from '../shared/utilities/router';
import { AdminProfiles } from '../../../api/user/AdminProfileCollection';
import {
  ANALYTICS,
  COMMUNITY,
  DATAMODEL,
  EXPLORER,
  FORECASTS,
  HOME,
  MANAGE,
  VISIBILITY,
} from '../../layouts/utilities/route-constants';

const convertLabelToId = (prefix, label) => `${prefix}-${label.replaceAll(' ', '-').toLowerCase()}`;

const AdminPageMenu: React.FC = () => {
  const match = useRouteMatch();
  const { username } = useParams();
  const profile = AdminProfiles.getProfile(username);

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

  /* Admins don't manage opportunities, since that's part of the data model */
  const manageDropdownItems = [
    { label: 'Students', route: MANAGE.STUDENTS },
    { label: 'Verification', route: MANAGE.VERIFICATION },
    { label: 'Reviews', route: MANAGE.REVIEWS },
    { label: 'Database', route: MANAGE.DATABASE },
    { label: 'Internships', route: MANAGE.INTERNSHIPS },
  ];

  const datamodelDropdownItems = [
    { label: 'Academic Terms', route: DATAMODEL.ACADEMIC_TERMS },
    { label: 'Academic Year Instances', route: DATAMODEL.ACADEMIC_YEAR_INSTANCES },
    { label: 'Career Goals', route: DATAMODEL.CAREERGOALS },
    { label: 'Course Instances', route: DATAMODEL.COURSE_INSTANCES },
    { label: 'Courses', route: DATAMODEL.COURSES },
    { label: 'Interests', route: DATAMODEL.INTERESTS },
    { label: 'Interest Keywords', route: DATAMODEL.INTEREST_KEYWORDS },
    { label: 'Interest Types', route: DATAMODEL.INTEREST_TYPES },
    { label: 'Opportunities', route: DATAMODEL.OPPORTUNITIES },
    { label: 'Opportunity Instances', route: DATAMODEL.OPPORTUNITY_INSTANCES },
    { label: 'Opportunity Types', route: DATAMODEL.OPPORTUNITY_TYPES },
    { label: 'Reviews', route: DATAMODEL.REVIEWS },
    { label: 'Slugs', route: DATAMODEL.SLUGS },
    { label: 'Teasers', route: DATAMODEL.TEASERS },
    { label: 'Users', route: DATAMODEL.USERS },
    { label: 'Verification Requests', route: DATAMODEL.VERIFICATION_REQUESTS },
  ];

  const analyticsDropdownItems = [
    { label: 'Newsletter', route: ANALYTICS.NEWSLETTER },
    { label: 'Behavior Table', route: ANALYTICS.BEHAVIOR_TABLE },
    { label: 'Logged In Users', route: ANALYTICS.LOGGED_IN_USERS },
  ];

  const instanceName = Meteor.settings.public.instanceName;
  return (
    <div>
      <FirstMenu profile={profile} displayLevelAndIce={false} instanceName={instanceName} />
      <Menu borderless inverted stackable id="secondMenu" attached="top" style={{ paddingLeft: '10px', marginTop: '0px' }}>
        {menuItems.map((item) => (
          <Menu.Item id={convertLabelToId('admin-menu', item.label)} key={item.label} as={NavLink} exact={false} to={buildRouteName(match, `/${item.route}`)}>
            {item.label}
          </Menu.Item>
        ))}

        <Dropdown item text="Explorers" id={COMPONENTIDS.ADMIN_MENU_EXPLORERS}>
          <Dropdown.Menu>
            {explorerDropdownItems.map((item) => (
              <Dropdown.Item id={convertLabelToId('admin-menu-explorer', item.label)} key={item.label} as={NavLink} exact to={buildRouteName(match, `/${item.route}`)} content={item.label} />
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown item text="Manage" id={COMPONENTIDS.ADMIN_MENU_MANAGE}>
          <Dropdown.Menu>
            {manageDropdownItems.map((item) => (
              <Dropdown.Item id={convertLabelToId('admin-menu-manage', item.label)} key={item.label} as={NavLink} exact to={buildRouteName(match, `/${item.route}`)} content={item.label} />
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown item text="Data Model" id="admin-menu-data-model">
          <Dropdown.Menu>
            {datamodelDropdownItems.map((item) => (
              <Dropdown.Item id={convertLabelToId('admin-menu-data-model', item.label)} key={item.label} as={NavLink} exact to={buildRouteName(match, `/${item.route}`)} content={item.label} />
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown item text="Analytics" id="admin-menu-analytics">
          <Dropdown.Menu>
            {analyticsDropdownItems.map((item) => (
              <Dropdown.Item id={convertLabelToId('admin-menu-analytics', item.label)} key={item.label} as={NavLink} exact to={buildRouteName(match, `/${item.route}`)} content={item.label} />
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
    </div>
  );
};

export default AdminPageMenu;
