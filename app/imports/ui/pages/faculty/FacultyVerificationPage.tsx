import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { useParams, useRouteMatch } from 'react-router-dom';
import PendingVerificationsWidget from '../../components/shared/verification/PendingVerificationsWidget';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import EventVerificationsWidget from '../../components/shared/verification/EventVerificationsWidget';
import { Opportunity, VerificationRequest } from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import CompletedVerificationsWidget from '../../components/shared/verification/CompletedVerificationsWidget';
import withAdditionalSubscriptions from '../../layouts/utilities/AdvisorFacultyAdditionalSubscriptionsHOC';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

// Technical Debt. We are looking at the Opportunities with the eventData field set. We now have four eventDates.

interface FacultyVerificationPageProps {
  verificationRequests: VerificationRequest[];
  eventOpportunities: Opportunity[];
}

const headerPaneTitle = 'Verify student participation';
const headerPaneBody = `
Student participation in RadGrad Opportunities involves the following:

  1. The student selects an Opportunity, and adds it to their Degree Plan for a specific academic term.
  2. The student participates (or fails to participate) in the Opportunity.
  3. The student requests verification that they participated in that opportunity during that term.

You can accept or decline these verification requests on this page. Accepting means the student earns the ICE points associated with that opportunity. If you decline a request, please provide a short comment explaining why. The student can resubmit with additional documentation. 

For more information, please see the [Faculty User Guide](https://www.radgrad.org/docs/users/faculty/overview).
`;

const FacultyVerificationPage: React.FC<FacultyVerificationPageProps> = ({ verificationRequests, eventOpportunities }) => {
  const match = useRouteMatch();

  return (
    <PageLayout id={PAGEIDS.FACULTY_VERIFICATION_PAGE} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
      <PendingVerificationsWidget pendingVerifications={verificationRequests.filter((ele) => ele.status === VerificationRequests.OPEN)}/>
      <EventVerificationsWidget eventOpportunities={eventOpportunities}/>
      <CompletedVerificationsWidget username={match.params.username} completedVerifications={verificationRequests.filter((ele) => VerificationRequests.ACCEPTED === ele.status || ele.status === VerificationRequests.REJECTED)}/>
    </PageLayout>
  );
};

const FacultyVerificationPageWithTracker = withTracker(() => {
  const { username } = useParams();
  const userID = Users.getID(username);
  const linkedOppInstances = OpportunityInstances.findNonRetired({ sponsorID: userID });
  const isLinkedReq = (verReq: VerificationRequest) => !!linkedOppInstances.find((oppI) => verReq.opportunityInstanceID === oppI._id);
  const verificationRequests = VerificationRequests.findNonRetired().filter((ele) => isLinkedReq(ele));
  const eventOpportunities = Opportunities.findNonRetired({ eventDate: { $exists: true } }); // TODO: change to eventDate1,2,3,4.
  return {
    verificationRequests,
    eventOpportunities,
  };
})(FacultyVerificationPage);
const FacultyVerificationPageContainer = withAdditionalSubscriptions(FacultyVerificationPageWithTracker);

export default FacultyVerificationPageContainer;
