import React from 'react';
import { Grid } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import BackToTopButton from '../../components/shared/BackToTopButton';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import {
  IAdvisorOrFacultyProfile,
  IFavoriteCareerGoal,
  IFavoriteInterest,
  IHelpMessage,
} from '../../../typings/radgrad';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import { Users } from '../../../api/user/UserCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import AdvisorAboutMeWidget from '../../components/advisor/home/AdvisorAboutMeWidget';

interface IAdvisorAboutMePageProps {
  profile: IAdvisorOrFacultyProfile,
  favoriteInterests: IFavoriteInterest[];
  favoriteCareerGoals: IFavoriteCareerGoal[];
  helpMessages: IHelpMessage[];
}

const AdvisorAboutMePage: React.FC<IAdvisorAboutMePageProps> = ({ profile, favoriteInterests, favoriteCareerGoals, helpMessages }) => (
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
  const profile: IAdvisorOrFacultyProfile = Users.getProfile(username);
  const userID = profile.userID;
  const favoriteInterests: IFavoriteInterest[] = FavoriteInterests.findNonRetired({ userID });
  const favoriteCareerGoals: IFavoriteCareerGoal[] = FavoriteCareerGoals.findNonRetired({ userID });
  const helpMessages: IHelpMessage[] = HelpMessages.findNonRetired({});
  return {
    profile,
    favoriteCareerGoals,
    favoriteInterests,
    helpMessages,
  };
})(AdvisorAboutMePage);

export default AdvisorAboutMePageContainer;
