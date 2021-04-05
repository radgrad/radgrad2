import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import Swal from 'sweetalert2';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { UserInteractionsTypes } from '../../../api/analytic/UserInteractionsTypes';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import {
  OpportunityInstance,
  UserInteractionDefine,
  VerificationRequest,
  VerificationRequestDefine,
} from '../../../typings/radgrad';
import { getUsername } from '../../components/shared/utilities/router';
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

const handleVerificationRequest = (instance, match) => (model) => {
  const collectionName = VerificationRequests.getCollectionName();
  const username = getUsername(match);
  const opportunityInstance = instance._id;
  const definitionData: VerificationRequestDefine = {
    student: username,
    opportunityInstance,
  };
  defineMethod.call({ collectionName, definitionData }, (error) => {
    if (error) {
      console.error(`Verification Request define ${definitionData} failed.`);
    } else {
      Swal.fire({
        title: 'Verification request sent.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      const slugID = OpportunityInstances.getOpportunityDoc(opportunityInstance).slugID;
      const slugName = Slugs.getNameFromID(slugID);
      const typeData = [slugName];
      const interactionData: UserInteractionDefine = {
        username,
        type: UserInteractionsTypes.VERIFY_REQUEST,
        typeData,
      };
      userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
        if (userInteractionError) {
          console.error('Error creating UserInteraction.', userInteractionError);
        }
      });
    }
  });
};

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
