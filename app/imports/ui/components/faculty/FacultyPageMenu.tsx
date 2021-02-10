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
import { EXPLORER_TYPE } from '../../layouts/utilities/route-constants';
import { AdvisorOrFacultyProfile } from '../../../typings/radgrad';

const FacultyPageMenu: React.FC = () => {
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
    { label: 'Community', route: 'community' },
  ];
  const explorerDropdownItems = [
    { key: 'Career Goals', route: EXPLORER_TYPE.CAREERGOALS },
    { key: 'Courses', route: EXPLORER_TYPE.COURSES },
    { key: 'Interests', route: EXPLORER_TYPE.INTERESTS },
    { key: 'Opportunities', route: EXPLORER_TYPE.OPPORTUNITIES },
  ];

  const facultyHomePageItems = [
    // { key: 'About Me', route: 'aboutme' },
  ];
  const instanceName = Meteor.settings.public.instanceName;
  return (
    <div>
      <FirstMenuContainer profile={profile} displayLevelAndIce={false} instanceName={instanceName} />
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

export default FacultyPageMenu;
