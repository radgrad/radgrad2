import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import FacultyPageAboutMeWidget from '../../components/faculty/home/FacultyPageAboutMeWidget';
import { getUserIdFromRoute, getUsername } from '../../components/shared/utilities/router';
import { IFacultyProfile, IFavoriteCareerGoal, IFavoriteInterest } from '../../../typings/radgrad';
import { Users } from '../../../api/user/UserCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';

interface IFacultyHomePageProps {
  match?: {
    params: {
      username: string;
      url: string;
      },
  }
  profile: IFacultyProfile;
  favoriteInterests: IFavoriteInterest[];
  favoriteCareerGoals: IFavoriteCareerGoal[];
}

const FacultyHomePage = (props: IFacultyHomePageProps) => (
  <div id="faculty-home-page">
    <FacultyPageMenuWidget />
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
            profile={props.profile}
            favoriteInterests={props.favoriteInterests}
            favoriteCareerGoals={props.favoriteCareerGoals}
            match={props.match}
          />
        </Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>
    </Grid>
  </div>
);

const FacultyHomePageCon = withTracker(({ match }) => {
  const username = getUsername(match);
  const profile: IFacultyProfile = Users.getProfile(username);
  const userID = getUserIdFromRoute(match);
  const favoriteInterests: IFavoriteInterest[] = FavoriteInterests.findNonRetired({ userID });
  const favoriteCareerGoals: IFavoriteCareerGoal[] = FavoriteCareerGoals.findNonRetired({ userID });
  return { profile, favoriteInterests, favoriteCareerGoals };
})(FacultyHomePage);

const FacultyHomePageContainer = withRouter(FacultyHomePageCon);

export default FacultyHomePageContainer;
