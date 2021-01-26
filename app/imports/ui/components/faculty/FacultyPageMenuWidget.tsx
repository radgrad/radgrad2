import React from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';
import { NavLink, useParams, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import FirstMenuContainer from '../shared/FirstMenu';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { buildRouteName } from '../shared/utilities/router';
import { COMMUNITY, EXPLORER_TYPE } from '../../layouts/utilities/route-constants';
import { AdvisorOrFacultyProfile } from '../../../typings/radgrad';

const FacultyPageMenuWidget: React.FC = () => {
  const divStyle = { marginBottom: 30 };

  const match = useRouteMatch();
  const { username } = useParams();
  const profile: AdvisorOrFacultyProfile = FacultyProfiles.getProfile(username);
  // const sponsorID = Users.getID(username);
  let openRequests = VerificationRequests.findNonRetired({ status: VerificationRequests.OPEN });
  openRequests = _.filter(openRequests, (request) => {
    if (OpportunityInstances.isDefined(request.opportunityInstanceID)) {
      const oi = OpportunityInstances.findDoc(request.opportunityInstanceID);
      return Opportunities.findDoc(oi.opportunityID).sponsorID === profile.userID;
    }
    return false;
  });

  const numRequests = openRequests.length;
  let requestsLabel = 'Verification';
  if (numRequests > 0) {
    requestsLabel = `${requestsLabel} (${numRequests})`;
  }
  const menuItems = [
    { label: 'Home', route: 'home', id: 'faculty-menu-home' },
    { label: requestsLabel, route: 'verification-requests', id: 'faculty-menu-verification' },
    { label: 'Manage Opportunities', route: 'manage-opportunities', id: 'faculty-menu-manage-opportunities' },
    { label: 'Scoreboard', route: 'scoreboard' },
  ];
  const explorerDropdownItems = [
    { key: 'Career Goals', route: EXPLORER_TYPE.CAREERGOALS },
    { key: 'Courses', route: EXPLORER_TYPE.COURSES },
    { key: 'Interests', route: EXPLORER_TYPE.INTERESTS },
    { key: 'Opportunities', route: EXPLORER_TYPE.OPPORTUNITIES },
  ];
  const communityDropdownItems = [
    { key: 'Members', route: COMMUNITY.USERS, id: 'facutly-menu-users' },
    { key: 'RadGrad Videos', route: COMMUNITY.RADGRADVIDEOS, id: 'faculty-menu-radgrad-videos' },
  ];

  const facultyHomePageItems = [
    // { key: 'About Me', route: 'aboutme' },
  ];

  return (
    <div style={divStyle}>
      <FirstMenuContainer profile={profile} displayLevelAndIce={false} />
      <Menu attached="top" borderless secondary inverted pointing id="secondMenu">
        {menuItems.map((item) => (
          <Menu.Item id={item.id} key={item.label} as={NavLink} exact={false} to={buildRouteName(match, `/${item.route}`)}>
            {item.label}
          </Menu.Item>
        ))}

        <Dropdown item text="EXPLORE">
          <Dropdown.Menu>
            {explorerDropdownItems.map((item) => (
              <Dropdown.Item key={item.key} as={NavLink} exact to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${item.route}`)} content={item.key} />
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown item id="student-menu-community" text="COMMUNITY">
          <Dropdown.Menu>
            {communityDropdownItems.map((item) => (
              <Dropdown.Item key={item.key} id={item.id} as={NavLink} exact to={buildRouteName(match, `/${COMMUNITY.HOME}/${item.route}`)} content={item.key} />
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Menu position="right">
          <Dropdown item text={`Aloha, ${profile.firstName} ${profile.lastName}!`}>
            <Dropdown.Menu>
              {facultyHomePageItems.map((item) => (
                <Dropdown.Item key={item.key} as={NavLink} exact to={buildRouteName(match, `/home/${item.route}`)} content={item.key} />
              ))}
              <Dropdown.Item as={NavLink} exact to="/signout" content="Sign Out" />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    </div>
  );
};

export default FacultyPageMenuWidget;
