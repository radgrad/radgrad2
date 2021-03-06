import React from 'react';
import { NavLink, useParams, useRouteMatch } from 'react-router-dom';
import { Dropdown, Menu } from 'semantic-ui-react';
import FirstMenuContainer from '../shared/FirstMenu';
import { Reviews } from '../../../api/review/ReviewCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { buildRouteName } from '../shared/utilities/router';
import { COMMUNITY, EXPLORER_TYPE } from '../../layouts/utilities/route-constants';
import { AdvisorOrFacultyProfile } from '../../../typings/radgrad';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';

const AdvisorPageMenu: React.FC = () => {
  const match = useRouteMatch();
  const { username } = useParams();
  const profile: AdvisorOrFacultyProfile = AdvisorProfiles.getProfile(username);
  let numMod = 0;
  numMod += Reviews.findNonRetired({ moderated: false }).length;
  let moderationLabel = 'Moderation';
  if (numMod > 0) {
    moderationLabel = `${moderationLabel} (${numMod})`;
  }
  let numRequests = 0;
  numRequests += VerificationRequests.findNonRetired({ status: 'Open' }).length;
  let requestsLabel = 'Verification Requests';
  if (numRequests > 0) {
    requestsLabel = `${requestsLabel} (${numRequests})`;
  }
  const menuItems = [
    { label: 'Student Configuration', route: 'home', id: 'advisor-menu-home' },
    { label: requestsLabel, route: 'verification-requests', id: 'advisor-menu-verification-requests' },
    { label: moderationLabel, route: 'moderation', id: 'advisor-menu-moderation' },
    { label: 'Scoreboard', route: 'scoreboard', regex: 'scoreboard', id: 'advisor-menu-scoreboard' },
    { label: 'Community', route: `${COMMUNITY}`, regex: `${COMMUNITY}`, id: 'advisor-menu-community' },
  ];
  const explorerDropdownItems = [
    { key: 'Career Goals', route: EXPLORER_TYPE.CAREERGOALS, id: 'advisor-menu-career-goals' },
    { key: 'Courses', route: EXPLORER_TYPE.COURSES, id: 'advisor-menu-courses' },
    { key: 'Interests', route: EXPLORER_TYPE.INTERESTS, id: 'advisor-menu-interests' },
    { key: 'Opportunities', route: EXPLORER_TYPE.OPPORTUNITIES, id: 'advisor-menu-opportunities' },
  ];

  const advisorHomePageItems = [{ key: 'About Me', route: 'aboutme', id: 'advisor-menu-about-me' }];
  const instanceName = Meteor.settings.public.instanceName;
  return (
    <div>
      <FirstMenuContainer profile={profile} displayLevelAndIce={false} instanceName={instanceName} />
      <Menu attached="top" borderless secondary inverted pointing id="secondMenu">
        {menuItems.map((item) => (
          <Menu.Item id={item.id} key={item.label} as={NavLink} exact to={buildRouteName(match, `/${item.route}`)}>
            {item.label}
          </Menu.Item>
        ))}

        <Dropdown id="advisor-menu-explore" item text="EXPLORE">
          <Dropdown.Menu>
            {explorerDropdownItems.map((item) => (
              <Dropdown.Item key={item.key} id={item.id} as={NavLink} exact to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${item.route}`)} content={item.key} />
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Menu position="right">
          <Dropdown id="advisor-menu-full-name" item text={`Aloha, ${profile.firstName} ${profile.lastName}!`}>
            <Dropdown.Menu>
              {advisorHomePageItems.map((item) => (
                <Dropdown.Item key={item.key} id={item.id} as={NavLink} exact to={buildRouteName(match, `/home/${item.route}`)} content={item.key} />
              ))}
              <Dropdown.Item id="advisor-menu-signout" as={NavLink} exact to="/signout" content="Sign Out" />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    </div>
  );
};

export default AdvisorPageMenu;
