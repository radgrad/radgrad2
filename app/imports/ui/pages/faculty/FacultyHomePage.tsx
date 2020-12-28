import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import FacultyAboutMeWidget from '../../components/faculty/home/FacultyAboutMeWidget';
import {
  AdvisorOrFacultyProfile,
  FavoriteCareerGoal,
  FavoriteInterest,
  HelpMessage,
} from '../../../typings/radgrad';
import { Users } from '../../../api/user/UserCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';

interface FacultyHomePageProps {
  profile: AdvisorOrFacultyProfile;
  favoriteInterests: FavoriteInterest[];
  favoriteCareerGoals: FavoriteCareerGoal[];
  helpMessages: HelpMessage[];
}

const FacultyHomePage: React.FC<FacultyHomePageProps> = ({ profile, helpMessages, favoriteCareerGoals, favoriteInterests }) => (
  <div id="faculty-home-page">
    <FacultyPageMenuWidget />
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}>
          <FacultyAboutMeWidget
            profile={profile}
            favoriteInterests={favoriteInterests}
            favoriteCareerGoals={favoriteCareerGoals}
          />
        </Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>
    </Grid>
  </div>
);

const FacultyHomePageContainer = withTracker(() => {
  const { username } = useParams();
  const profile: AdvisorOrFacultyProfile = Users.getProfile(username);
  const userID = profile.userID;
  const favoriteInterests: FavoriteInterest[] = FavoriteInterests.findNonRetired({ userID });
  const favoriteCareerGoals: FavoriteCareerGoal[] = FavoriteCareerGoals.findNonRetired({ userID });
  const helpMessages = HelpMessages.findNonRetired({});
  return { profile, favoriteInterests, favoriteCareerGoals, helpMessages };
})(FacultyHomePage);

export default withListSubscriptions(FacultyHomePageContainer, [
  FacultyProfiles.getPublicationName(),
  FavoriteCareerGoals.getPublicationName(),
  FavoriteInterests.getPublicationName(),
  HelpMessages.getPublicationName(),
  Opportunities.getPublicationName(),
  OpportunityInstances.getPublicationName(),
  Users.getPublicationName(),
  VerificationRequests.getPublicationName(),
]);
