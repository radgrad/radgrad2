import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router-dom';
import { _ } from 'meteor/erasaur:meteor-lodash';
import FirstMenuContainer from '../../pages/shared/FirstMenu';
import { Reviews } from '../../../api/review/ReviewCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
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

class FacultyPageMenuWidget extends React.Component<IFacultyPageMenuWidgetProps> {
  public render() {
    const username = this.props.match.params.username;
    const faculty = FacultyProfiles.findDoc(username);
    // const sponsorID = Users.getID(username);
    let openRequests = VerificationRequests.find({ status: VerificationRequests.OPEN }).fetch();
    openRequests = _.filter(openRequests, (request) => {
      const oi = OpportunityInstances.findDoc(request.opportunityInstanceID);
      return Opportunities.findDoc(oi.opportunityID).sponsorID === faculty.userID;
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
      { label: 'Course Scoreboard', route: 'course-scoreboard' },
    ];
    return (
      <div>
        <FirstMenuContainer/>
        <SecondMenu menuItems={menuItems} numItems={menuItems.length}/>
      </div>
    );
  }
}

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(FacultyPageMenuWidget);
