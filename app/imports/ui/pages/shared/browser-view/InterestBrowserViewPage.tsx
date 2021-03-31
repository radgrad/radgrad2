import moment from 'moment';
import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { Interests } from '../../../../api/interest/InterestCollection';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { Users } from '../../../../api/user/UserCollection';
import { Interest } from '../../../../typings/radgrad';
import InterestBrowserView from '../../../components/shared/explorer/browser-view/InterestBrowserView';
import PageLayout from '../../PageLayout';
import {updateLastVisitedMethod} from '../../../../api/user/BaseProfileCollection.methods';
import {EXPLORER_TYPE} from '../../../layouts/utilities/route-constants';

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
  let profile: any;
  if (Users.hasProfile(username)) {
    profile = Users.getProfile(username);
  }
  const collectionName = StudentProfiles.getCollectionName();
  const lastVisited = moment().format('YYYY-MM-DD');
  if (Users.hasProfile(username) && lastVisited !== profile.lastVisitedInterests) {
    updateLastVisitedMethod.call(
      {
        collectionName: collectionName,
        lastVisitedTime: lastVisited,
        type: EXPLORER_TYPE.INTERESTS,
      },
    );
  }
  const allInterests = Users.getInterestIDs(profile.userID);
  const profileInterests = allInterests.map((id) => Interests.findDoc(id));
  const interests = Interests.findNonRetired({});
  const nonProfileInterests = _.filter(interests, md => profileInterests.every(fd => fd._id !== md._id));
  return {
    profileInterests,
    nonProfileInterests,
  };
})(InterestBrowserViewPage);
