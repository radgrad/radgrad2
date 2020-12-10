import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import FacultyAboutMeWidget from '../../components/faculty/home/FacultyAboutMeWidget';
import {
  IAdvisorOrFacultyProfile,
  IFavoriteCareerGoal,
  IFavoriteInterest,
  IHelpMessage,
} from '../../../typings/radgrad';
import { Users } from '../../../api/user/UserCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { withListSubscriptions } from '../../layouts/utilities/SubscriptionListHOC';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection';

interface IFacultyHomePageProps {
  profile: IAdvisorOrFacultyProfile;
  favoriteInterests: IFavoriteInterest[];
  favoriteCareerGoals: IFavoriteCareerGoal[];
  helpMessages: IHelpMessage[];
}

const FacultyHomePage: React.FC<IFacultyHomePageProps> = ({ profile, helpMessages, favoriteCareerGoals, favoriteInterests }) => (
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
  const profile: IAdvisorOrFacultyProfile = Users.getProfile(username);
  const userID = profile.userID;
  const favoriteInterests: IFavoriteInterest[] = FavoriteInterests.findNonRetired({ userID });
  const favoriteCareerGoals: IFavoriteCareerGoal[] = FavoriteCareerGoals.findNonRetired({ userID });
  const helpMessages = HelpMessages.findNonRetired({});
  return { profile, favoriteInterests, favoriteCareerGoals, helpMessages };
})(FacultyHomePage);

export default withListSubscriptions(FacultyHomePageContainer, [
  CareerGoals.getPublicationName(),
  FacultyProfiles.getPublicationName(),
  FavoriteInterests.getPublicationName(),
  FavoriteCareerGoals.getPublicationName(),
  HelpMessages.getPublicationName(),
  Interests.getPublicationName(),
  Opportunities.getPublicationName(),
  OpportunityInstances.getPublicationName(),
  Users.getPublicationName(),
  VerificationRequests.getPublicationName(),
]);
