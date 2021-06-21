import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { Dropdown, Menu } from 'semantic-ui-react';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { StudentProfile } from '../../../typings/radgrad';
import {
  DEGREEPLANNER,
  EXPLORER,
  HOME,
  ICE,
  LEVELS,
  COMMUNITY,
  VISIBILITY,
  STUDENT_REVIEWS,
  STUDENT_VERIFICATION,
  URL_ROLES,
} from '../../layouts/utilities/route-constants';
import FirstMenu from '../shared/FirstMenu';
import { getUsername } from '../shared/utilities/router';
import { COMPONENTIDS } from '../../utilities/ComponentIDs';

const StudentPageMenu: React.FC = () => {
  const match = useRouteMatch();
  const username = getUsername(match);
  const profile: StudentProfile = StudentProfiles.getProfile(username);
  const earnedIce = StudentProfiles.getEarnedICE(username);
  const projectedIce = StudentProfiles.getProjectedICE(username);
  const instanceName = Meteor.settings.public.instanceName;

  const homeItem = [
    { to: `/${URL_ROLES.STUDENT}/${username}/${HOME}`, label: 'Home' },
  ];

  const explorerDropdownItems = [
    { to: `/${URL_ROLES.STUDENT}/${username}/${EXPLORER.INTERESTS}`, label: 'Interests'  },
    { to: `/${URL_ROLES.STUDENT}/${username}/${EXPLORER.CAREERGOALS}`, label: 'Career Goals' },
    { to: `/${URL_ROLES.STUDENT}/${username}/${EXPLORER.OPPORTUNITIES}`, label: 'Opportunities' },
    { to: `/${URL_ROLES.STUDENT}/${username}/${EXPLORER.INTERNSHIPS}`, label: 'Internships' },
  ];

  const menuItems = [
    { to: `/${URL_ROLES.STUDENT}/${username}/${EXPLORER.COURSES}`, label: 'Courses' },
    { to: `/${URL_ROLES.STUDENT}/${username}/${DEGREEPLANNER}`, label: 'Planner' },
    { to: `/${URL_ROLES.STUDENT}/${username}/${STUDENT_VERIFICATION}`, label: 'Verification' },
    { to: `/${URL_ROLES.STUDENT}/${username}/${VISIBILITY}`, label: 'Visibility' },
    { to: `/${URL_ROLES.STUDENT}/${username}/${ICE}`, label: 'ICE' },
    { to: `/${URL_ROLES.STUDENT}/${username}/${LEVELS}`, label: 'Levels' },
    { to: `/${URL_ROLES.STUDENT}/${username}/${STUDENT_REVIEWS}`, label: 'Reviews' },
    { to: `/${URL_ROLES.STUDENT}/${username}/${COMMUNITY}`, label: 'Community' },
  ];

  return (
    <div>
      <FirstMenu profile={profile} displayLevelAndIce earnedICE={earnedIce} projectedICE={projectedIce} instanceName={instanceName} />
      <Menu borderless inverted stackable id="secondMenu" attached="top" style={{ paddingLeft: '10px', marginTop: '0px' }}>
        <Menu.Item key={homeItem[0].label} id={`student-menu-${homeItem[0].label.toLowerCase()}`} as={NavLink} exact to={homeItem[0].to}>{homeItem[0].label}</Menu.Item>
        <Dropdown item text="Explore..." id={COMPONENTIDS.STUDENT_MENU_EXPLORERS}>
          <Dropdown.Menu>
            {explorerDropdownItems.map(item => <Menu.Item key={item.label} id={`student-menu-${item.label.toLowerCase()}`} as={NavLink} exact to={item.to}>{item.label}</Menu.Item>)}
          </Dropdown.Menu>
        </Dropdown>
        {menuItems.map(item => <Menu.Item key={item.label} id={`student-menu-${item.label.toLowerCase()}`} as={NavLink} exact to={item.to}>{item.label}</Menu.Item>)}
      </Menu>
    </div>
  );
};

export default StudentPageMenu;
