import React from 'react';
import {NavLink, useRouteMatch} from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import {StudentProfiles} from '../../../api/user/StudentProfileCollection';
import {StudentProfile} from '../../../typings/radgrad';
import {
  DEGREEPLANNER,
  EXPLORER_TYPE,
  HOME,
  ICE,
  LEVELS,
  COMMUNITY,
  STUDENT_PRIVACY,
  STUDENT_REVIEWS,
  STUDENT_VERIFICATION,
  URL_ROLES,
} from '../../layouts/utilities/route-constants';
import FirstMenu from '../shared/FirstMenu';
import {getUsername} from '../shared/utilities/router';

const StudentPageMenu: React.FC = () => {
  const match = useRouteMatch();
  const username = getUsername(match);
  const profile: StudentProfile = StudentProfiles.getProfile(username);
  const earnedIce = StudentProfiles.getEarnedICE(username);
  const projectedIce = StudentProfiles.getProjectedICE(username);
  const instanceName = Meteor.settings.public.instanceName;
  const menuItems = [
    {label: 'Home',  to: `/${URL_ROLES.STUDENT}/${username}/${HOME}`},
    {label: 'Interests',  to: `/${URL_ROLES.STUDENT}/${username}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}`},
    {label: 'Careers',  to: `/${URL_ROLES.STUDENT}/${username}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}`},
    {label: 'Courses',  to: `/${URL_ROLES.STUDENT}/${username}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}`},
    {label: 'Opportunities',  to: `/${URL_ROLES.STUDENT}/${username}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}`},
    {label: 'Planner',  to: `/${URL_ROLES.STUDENT}/${username}/${DEGREEPLANNER}`},
    {label: 'Verification',  to: `/${URL_ROLES.STUDENT}/${username}/${STUDENT_VERIFICATION}`},
    {label: 'Privacy',  to: `/${URL_ROLES.STUDENT}/${username}/${STUDENT_PRIVACY}`},
    {label: 'ICE',  to: `/${URL_ROLES.STUDENT}/${username}/${HOME}/${ICE}`},
    {label: 'Levels',  to: `/${URL_ROLES.STUDENT}/${username}/${HOME}/${LEVELS}`},
    {label: 'Reviews',  to: `/${URL_ROLES.STUDENT}/${username}/${STUDENT_REVIEWS}`},
    {label: 'Community',  to: `/${URL_ROLES.STUDENT}/${username}/${COMMUNITY}`},
  ];
  return (
    <div>
      <FirstMenu profile={profile} displayLevelAndIce earnedICE={earnedIce} projectedICE={projectedIce} instanceName={instanceName} />
      <div className="radgrad-menu" id="menu">
        <Menu attached="top" borderless inverted stackable id="secondMenu">
          {menuItems.map(item => <Menu.Item key={item.label} id={`student-menu-${item.label.toLowerCase()}`} as={NavLink} exact to={item.to}>{item.label}</Menu.Item>)}
        </Menu>
      </div>
    </div>
  );
};

export default StudentPageMenu;
