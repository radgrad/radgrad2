import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Users } from '../../../../api/user/UserCollection';
import { Interest, StudentProfile } from '../../../../typings/radgrad';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import { EXPLORERTYPE } from '../../../utilities/ExplorerType';
import BrowserView from '../../../components/shared/explorer/browser-view/BrowserView';

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
  <PageLayout id={PAGEIDS.INTEREST_BROWSER} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}
              headerPaneImage={headerPaneImage}>
    <BrowserView items={profileInterests} explorerType={EXPLORERTYPE.INTERESTS} inProfile  />
    <BrowserView items={nonProfileInterests} explorerType={EXPLORERTYPE.INTERESTS} inProfile={false} />
  </PageLayout>
);

export default withTracker(() => {
  const { username } = useParams();
  let profile: StudentProfile;
  if (Users.hasProfile(username)) {
    profile = Users.getProfile(username);
  }
  const profileInterests = Users.getInterestIDs(profile.userID).map((id) => Interests.findDoc(id));
  const nonProfileInterests = Interests.findNonRetired().filter(md => profileInterests.every(fd => fd._id !== md._id));
  return {
    profileInterests,
    nonProfileInterests,
  };
},
)(InterestBrowserViewPage);
