import * as React from 'react';
import { withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import FirstMenuContainer from '../../pages/shared/FirstMenu';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import SecondMenu from '../../pages/shared/SecondMenu';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';

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

  const username = props.match.params.username;
  const faculty = FacultyProfiles.findDoc(username);
  // const sponsorID = Users.getID(username);
  let openRequests = VerificationRequests.find({ status: VerificationRequests.OPEN }).fetch();
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
  return (
    <div style={divStyle}>
      <FirstMenuContainer />
      <SecondMenu menuItems={menuItems} numItems={menuItems.length} />
    </div>
  );
};

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(FacultyPageMenuWidget);
