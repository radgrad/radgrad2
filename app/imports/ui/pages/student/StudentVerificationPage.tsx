import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Segment } from 'semantic-ui-react';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import {
  CourseInstance,
  OpportunityInstance,
  VerificationRequest,
} from '../../../typings/radgrad';
import StudentUnverifiedOpportunities from '../../components/student/verification-requests/StudentUnverifiedOpportunities';
import StudentVerifiedOpportunitiesAndCourses
  from '../../components/student/verification-requests/StudentVerifiedOpportunitiesAndCourses';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'Verify that you completed your opportunities';
const headerPaneBody = `
To earn the Innovation and/or Experience points for an Opportunity, you must request verification.

This page lists all Opportunities in your Degree Plan from a previous semester. If you have completed the Opportunity, please request verification. 

If you didn't do it, then please go to the Degree Plan page and delete it.  
`;
const headerPaneImage = 'images/header-panel/header-verification.png';

interface StudentVerificationPageProps {
  unVerifiedOpportunityInstances: OpportunityInstance[];
  verificationRequests: VerificationRequest[];
  verifiedOpportunityInstances: OpportunityInstance[];
  verifiedCourseInstances: CourseInstance[];
  student: string;
}

const StudentVerificationPage: React.FC<StudentVerificationPageProps> = ({ unVerifiedOpportunityInstances, student, verificationRequests, verifiedOpportunityInstances, verifiedCourseInstances }) => (
  <PageLayout id={PAGEIDS.STUDENT_VERIFICATION} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={16}>
          <StudentUnverifiedOpportunities unVerifiedOpportunityInstances={unVerifiedOpportunityInstances}
            verificationRequests={verificationRequests} student={student} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Segment>
            <StudentVerifiedOpportunitiesAndCourses verifiedOpportunityInstances={verifiedOpportunityInstances}  verifiedCourseInstances={verifiedCourseInstances}/>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </PageLayout>
);

export default withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username);
  const studentID = profile.userID;
  const unVerifiedOpportunityInstances = OpportunityInstances.getUnverifiedInstances(studentID);
  const verificationRequests = VerificationRequests.findNonRetired({ studentID });
  const verifiedOpportunityInstances = OpportunityInstances.findNonRetired({ studentID, verified: true });
  const verifiedCourseInstances = CourseInstances.findNonRetired({ studentID, verified: true });
  return {
    unVerifiedOpportunityInstances,
    verificationRequests,
    verifiedOpportunityInstances,
    verifiedCourseInstances,
    student: username,
  };

})(StudentVerificationPage);
