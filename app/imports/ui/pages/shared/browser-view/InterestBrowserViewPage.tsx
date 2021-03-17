import moment from 'moment';
import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';
import { Interests } from '../../../../api/interest/InterestCollection';
import { ROLE } from '../../../../api/role/Role';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { Users } from '../../../../api/user/UserCollection';
import { Interest, StudentProfileUpdate } from '../../../../typings/radgrad';
import InterestBrowserView from '../../../components/shared/explorer/browser-view/InterestBrowserView';
import PageLayout from '../../PageLayout';

interface InterestBrowserViewPageProps {
  profileInterests: Interest[];
  nonProfileInterests: Interest[];
}

const headerPaneTitle = 'Find your interests';
const headerPaneBody = `
Interests specify disciplinary areas as well as other areas with a strong overlap.

Specify at least three interests so RadGrad can recommend related courses, opportunities, and community members.

If we've missed a disciplinary area of interest to you, please click the button below to ask a RadGrad administrator to add it to the system. 
`;
const headerPaneImage = 'header-interests.png';

const InterestBrowserViewPage: React.FC<InterestBrowserViewPageProps> = ({ profileInterests, nonProfileInterests }) => (
    <PageLayout id="interest-browser-view-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <InterestBrowserView interests={profileInterests} inProfile />
      <InterestBrowserView interests={nonProfileInterests} />
    </PageLayout>
);

export default withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username);
  if (profile.role === ROLE.STUDENT) {
    const lastVisited = moment().format('YYYY-MM-DD');
    if (lastVisited !== profile.lastVisitedInterests) {
      const collectionName = StudentProfiles.getCollectionName();
      const updateData: StudentProfileUpdate = {};
      updateData.id = profile._id;
      updateData.lastVisitedInterests = lastVisited;
      updateMethod.call({ collectionName, updateData }, (error, result) => {
        if (error) {
          console.error('Error updating StudentProfile', collectionName, updateData, error);
        }
      });
    }
  }
  const allInterests = Users.getInterestIDs(profile.userID);
  const profileInterests = allInterests.map((id) => Interests.findDoc(id));
  const interests = Interests.findNonRetired({}); // TODO should we filter out the ones in the profile?
  const nonProfileInterests = _.filter(interests, md => profileInterests.every(fd => fd._id !== md._id));
  return {
    profileInterests,
    interests,
    nonProfileInterests,
  };
})(InterestBrowserViewPage);
