import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { ProfileCareerGoals } from '../../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { Users } from '../../../../api/user/UserCollection';
import { CareerGoal, StudentProfile } from '../../../../typings/radgrad';
import BrowserView from '../../../components/shared/explorer/browser-view/BrowserView';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import { EXPLORER_TYPE } from '../../../utilities/ExplorerUtils';

interface CareerGoalBrowserViewPageProps {
  profileCareerGoals: CareerGoal[];
  profileInterestIDs: string[];
  nonProfileCareerGoals: CareerGoal[];
}

const headerPaneTitle = 'Find your career goals';
const headerPaneBody = `
Career Goals are curated by the faculty to represent a good selection of the most promising career paths. Most career goals encompass several job titles. 

Specify at least three career goals so RadGrad can recommend related courses, opportunities, and community members.

If we've missed a career goal of interest to you, please click the button below to ask a RadGrad administrator to add it to the system. 
`;
const headerPaneImage = 'header-career.png';

const CareerGoalBrowserViewPage: React.FC<CareerGoalBrowserViewPageProps> = ({
  profileCareerGoals,
  profileInterestIDs,
  nonProfileCareerGoals,
}) => (
    <PageLayout id={PAGEIDS.CAREER_GOAL_BROWSER} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <BrowserView profileInterestIDs={profileInterestIDs}
                   items={profileCareerGoals}
                   explorerType={EXPLORER_TYPE.CAREERGOALS}
                   inProfile />
      <BrowserView profileInterestIDs={profileInterestIDs}
                   items={nonProfileCareerGoals}
                   explorerType={EXPLORER_TYPE.CAREERGOALS}
                   inProfile={false}/>
    </PageLayout>
);

export default withTracker(() => {
  const { username } = useParams();
  let profile: StudentProfile;
  if (Users.hasProfile(username)) {
    profile = Users.getProfile(username);
  }
  const profileCareerGoals = ProfileCareerGoals.findNonRetired({ userID: profile.userID }).map((f) => CareerGoals.findDoc(f.careerGoalID));
  const profileInterestIDs = Users.getInterestIDs(username);
  const nonProfileCareerGoals = CareerGoals.findNonRetired().filter( md => profileCareerGoals.every(fd => fd._id !== md._id));
  return {
    profileCareerGoals,
    profileInterestIDs,
    nonProfileCareerGoals,
  };
})(CareerGoalBrowserViewPage);
