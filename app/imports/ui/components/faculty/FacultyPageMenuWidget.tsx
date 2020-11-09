import React from 'react';

import { Dropdown, Menu } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import _ from 'lodash';
import FirstMenuContainer from '../../pages/shared/FirstMenu';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { secondMenu } from '../shared/shared-widget-names';

import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';

import { buildRouteName, getUsername } from '../shared/RouterHelperFunctions';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import { IFacultyProfile } from '../../../typings/radgrad';

interface IFacultyPageMenuWidgetProps {
  match?: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const FacultyPageMenuWidget = (props: IFacultyPageMenuWidgetProps) => {
  const divStyle = { marginBottom: 30 };

  const { match } = props;
  const username = getUsername(match);
  const faculty = FacultyProfiles.findDoc(username);

  const profile: IFacultyProfile = FacultyProfiles.getProfile(username);
  // const sponsorID = Users.getID(username);
  let openRequests = VerificationRequests.findNonRetired({ status: VerificationRequests.OPEN });
  openRequests = _.filter(openRequests, (request) => {
    if (OpportunityInstances.isDefined(request.opportunityInstanceID)) {
      const oi = OpportunityInstances.findDoc(request.opportunityInstanceID);
      return Opportunities.findDoc(oi.opportunityID).sponsorID === faculty.userID;
    }
    return false;
  });

  const numRequests = openRequests.length;
  let requestsLabel = 'Verification';
  if (numRequests > 0) {
    requestsLabel = `${requestsLabel} (${numRequests})`;
  }
  const menuItems = [
    { label: 'Home', route: 'home' },
    { label: requestsLabel, route: 'verification-requests' },
    { label: 'Manage Opportunities', route: 'manage-opportunities' },
    { label: 'Explorer', route: 'explorer' },
    { label: 'Scoreboard', route: 'scoreboard' },
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
      <FirstMenuContainer />
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

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(FacultyPageMenuWidget);
