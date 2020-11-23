import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Dropdown, Menu } from 'semantic-ui-react';
import FirstMenuContainer from '../shared/FirstMenu';
import { Reviews } from '../../../api/review/ReviewCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { secondMenu } from '../shared/shared-widget-names';
import { buildRouteName, getUsername } from '../shared/utilities/router';
import { COMMUNITY, EXPLORER_TYPE } from '../../layouts/utilities/route-constants';
import { IAdvisorOrFacultyProfile } from '../../../typings/radgrad';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';

const AdvisorPageMenuWidget = (props: { match }) => {
  const { match } = props;
  const username = getUsername(match);
  const divStyle = { marginBottom: 30 };
  const firstMenuStyle = { minHeight: 78 };
  const profile: IAdvisorOrFacultyProfile = AdvisorProfiles.getProfile(username);
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
    { label: 'Academic Plan', route: 'academic-plan', id: 'advisor-menu-academic-plan' },
    { label: 'Scoreboard', route: 'scoreboard', regex: 'scoreboard', id: 'advisor-menu-scoreboard' },
  ];
  const explorerDropdownItems = [
    { key: 'Academic Plans', route: EXPLORER_TYPE.ACADEMICPLANS, id: 'advisor-menu-academic-plans' },
    { key: 'Career Goals', route: EXPLORER_TYPE.CAREERGOALS, id: 'advisor-menu-career-goals' },
    { key: 'Courses', route: EXPLORER_TYPE.COURSES, id: 'advisor-menu-courses' },
    { key: 'Interests', route: EXPLORER_TYPE.INTERESTS, id: 'advisor-menu-interests' },
    { key: 'Opportunities', route: EXPLORER_TYPE.OPPORTUNITIES, id: 'advisor-menu-opportunities' },
  ];

  const communityDropdownItems = [
    { key: 'Members', route: COMMUNITY.USERS, id: 'facutly-menu-users' },
    { key: 'RadGrad Videos', route: COMMUNITY.RADGRADVIDEOS, id: 'faculty-menu-radgrad-videos' },
  ];

  const advisorHomePageItems = [
    { key: 'About Me', route: 'aboutme', id: 'advisor-menu-about-me' },
  ];
  return (
    <div style={divStyle}>
      <FirstMenuContainer style={firstMenuStyle} />
      <Menu
        attached="top"
        borderless
        secondary
        inverted
        pointing
        id={`${secondMenu}`}
      >
        {menuItems.map((item) => (
          <Menu.Item
            id={item.id}
            key={item.label}
            as={NavLink}
            exact
            to={buildRouteName(match, `/${item.route}`)}
          >
            {item.label}
          </Menu.Item>
        ))}

        <Dropdown id="advisor-menu-explore" item text="EXPLORE">
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
          <Dropdown id="advisor-menu-full-name" item text={`Aloha, ${profile.firstName} ${profile.lastName}!`}>
            <Dropdown.Menu>
              {advisorHomePageItems.map((item) => (
                <Dropdown.Item
                  key={item.key}
                  id={item.id}
                  as={NavLink}
                  exact
                  to={buildRouteName(match, `/home/${item.route}`)}
                  content={item.key}
                />
              ))}
              <Dropdown.Item id="advisor-menu-signout" as={NavLink} exact to="/signout" content="Sign Out" />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    </div>
  );
};

export default withRouter(AdvisorPageMenuWidget);
