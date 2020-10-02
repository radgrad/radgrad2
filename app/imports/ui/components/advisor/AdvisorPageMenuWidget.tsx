import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Dropdown, Menu } from 'semantic-ui-react';
import FirstMenuContainer from '../../pages/shared/FirstMenu';
import { Reviews } from '../../../api/review/ReviewCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { secondMenu } from '../shared/shared-widget-names';
import { buildRouteName, getUsername } from '../shared/RouterHelperFunctions';
import {EXPLORER_TYPE } from '../../../startup/client/route-constants';
import { IAdvisorProfile } from '../../../typings/radgrad';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';

interface IFilterStudents {
  selectedUsername: string;
  usernameDoc: IStudentProfile;
  interests: IInterest[];
  careerGoals: ICareerGoal[];
  advisorLogs: IAdvisorLog[];
  match: {
    params: {
      username: string;
    }
  }
}
const AdvisorPageMenuWidget = (props: IAdvisorProfile) => {
  const { match } = props;
  const username = getUsername(match);
  const divStyle = { marginBottom: 30 };
  const firstMenuStyle = { minHeight: 78 };
  const profile: IAdvisorProfile = AdvisorProfiles.getProfile(username);
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
    { label: 'Student Configuration', route: 'home' },
    { label: requestsLabel, route: 'verification-requests' },
    { label: moderationLabel, route: 'moderation' },
    { label: 'Academic Plan', route: 'academic-plan' },
    { label: 'Scoreboard', route: 'scoreboard', regex: 'scoreboard' },
  ];
  const explorerDropdownItems = [
  { key: 'Academic Plans', route: EXPLORER_TYPE.ACADEMICPLANS },
  { key: 'Career Goals', route: EXPLORER_TYPE.CAREERGOALS },
  { key: 'Courses', route: EXPLORER_TYPE.COURSES },
  { key: 'Interests', route: EXPLORER_TYPE.INTERESTS },
  { key: 'Opportunities', route: EXPLORER_TYPE.OPPORTUNITIES },
];

const studentHomePageItems = [
  { key: 'About Me', route: 'aboutme' },

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
          <Menu.Item key={item.label} as={NavLink} exact={false} to={buildRouteName(match, `/${item.route}`)}>
            {item.label}
          </Menu.Item>
      ))}

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
    </div>
  );
};

export default withRouter(AdvisorPageMenuWidget);
