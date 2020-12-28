import React from 'react';
import { Grid } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import BackToTopButton from '../../components/shared/BackToTopButton';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import {
  AdvisorOrFacultyProfile,
  FavoriteCareerGoal,
  FavoriteInterest,
  HelpMessage,
} from '../../../typings/radgrad';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import { Users } from '../../../api/user/UserCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import AdvisorAboutMeWidget from '../../components/advisor/home/AdvisorAboutMeWidget';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';

interface AdvisorAboutMePageProps {
  profile: AdvisorOrFacultyProfile,
  favoriteInterests: FavoriteInterest[];
  favoriteCareerGoals: FavoriteCareerGoal[];
  helpMessages: HelpMessage[];
}

const AdvisorAboutMePage: React.FC<AdvisorAboutMePageProps> = ({ profile, favoriteInterests, favoriteCareerGoals, helpMessages }) => (
  <div id="advisor-about-me-page">
    <AdvisorPageMenuWidget />
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}>
          <AdvisorAboutMeWidget
            profile={profile}
            favoriteInterests={favoriteInterests}
            favoriteCareerGoals={favoriteCareerGoals}
          />
        </Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>
    </Grid>
    <BackToTopButton />
  </div>
);

const AdvisorAboutMePageContainer = withTracker(() => {
  const { username } = useParams();
  const profile: AdvisorOrFacultyProfile = Users.getProfile(username);
  const userID = profile.userID;
  const favoriteInterests: FavoriteInterest[] = FavoriteInterests.findNonRetired({ userID });
  const favoriteCareerGoals: FavoriteCareerGoal[] = FavoriteCareerGoals.findNonRetired({ userID });
  const helpMessages: HelpMessage[] = HelpMessages.findNonRetired({});
  return {
    profile,
    favoriteCareerGoals,
    favoriteInterests,
    helpMessages,
  };
})(AdvisorAboutMePage);

export default withListSubscriptions(AdvisorAboutMePageContainer, [
  Users.getPublicationName(),
  FacultyProfiles.getPublicationName(),
  AdvisorProfiles.getPublicationName(),
  FavoriteCareerGoals.getPublicationName(),
  FavoriteInterests.getPublicationName(),
  HelpMessages.getPublicationName(),
]);
