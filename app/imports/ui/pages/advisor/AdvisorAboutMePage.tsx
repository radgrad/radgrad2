import React from 'react';
import { Grid } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import BackToTopButton from '../../components/shared/BackToTopButton';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import { IAdvisorOrFacultyProfile, IFavoriteCareerGoal, IFavoriteInterest } from '../../../typings/radgrad';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import FacultyPageAboutMeWidget from '../../components/faculty/home/FacultyPageAboutMeWidget';
import { Users } from '../../../api/user/UserCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';

interface IAdvisorAboutMePageProps {
  profile: IAdvisorOrFacultyProfile,
  favoriteInterests: IFavoriteInterest[];
  favoriteCareerGoals: IFavoriteCareerGoal[];
}

const AdvisorAboutMePage = (props: IAdvisorAboutMePageProps) => {
  const { profile, favoriteInterests, favoriteCareerGoals } = props;
  return (
    <div id="advisor-about-me-page">
      <AdvisorPageMenuWidget />
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}><HelpPanelWidget /></Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}>
            <FacultyPageAboutMeWidget
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
};

const AdvisorAboutMePageContainer = withTracker(() => {
  const { username } = useParams();
  const profile: IAdvisorOrFacultyProfile = Users.getProfile(username);
  const userID = profile.userID;
  const favoriteInterests: IFavoriteInterest[] = FavoriteInterests.findNonRetired({ userID });
  const favoriteCareerGoals: IFavoriteCareerGoal[] = FavoriteCareerGoals.findNonRetired({ userID });
  return {
    profile,
    favoriteCareerGoals,
    favoriteInterests,
  };
})(AdvisorAboutMePage);

export default AdvisorAboutMePageContainer;
