import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import {
  OpportunityInstance,
  VerificationRequest,
} from '../../../typings/radgrad';
import StudentUnverifiedOpportunities from '../../components/student/verification-requests/StudentUnverifiedOpportunities';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'Verify that you completed your opportunities';
const headerPaneBody = `
To earn the Innovation and/or Experience points for an Opportunity, you must request verification.

This page lists all Opportunities in your Degree Plan from a previous semester. If you have completed the Opportunity, please request verification. 

If you didn't do it, then please go to the Degree Plan page and delete it.  
`;
const headerPaneImage = 'header-verification.png';

interface StudentVerificationPageProps {
  unVerifiedOpportunityInstances: OpportunityInstance[];
  verificationRequests: VerificationRequest[];
  student: string;
}

const StudentVerificationPage: React.FC<StudentVerificationPageProps> = ({ unVerifiedOpportunityInstances, student, verificationRequests }) => (
  <PageLayout id="student-verification-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <StudentUnverifiedOpportunities unVerifiedOpportunityInstances={unVerifiedOpportunityInstances} verificationRequests={verificationRequests} student={student} />
  </PageLayout>
);

export default withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username);
  const studentID = profile.userID;
  const unVerifiedOpportunityInstances = OpportunityInstances.getUnverifiedInstances(studentID);
  const verificationRequests = VerificationRequests.findNonRetired({ studentID });
  return {
    unVerifiedOpportunityInstances,
    verificationRequests,
    student: username,
  };

})(StudentVerificationPage);
