import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import FacultyPageAboutMeWidget from '../../components/faculty/home/FacultyPageAboutMeWidget';
import {
  IAdvisorOrFacultyProfile,
  IFavoriteCareerGoal,
  IFavoriteInterest,
  IHelpMessage,
} from '../../../typings/radgrad';
import { Users } from '../../../api/user/UserCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';

interface IFacultyHomePageProps {
  profile: IAdvisorOrFacultyProfile;
  favoriteInterests: IFavoriteInterest[];
  favoriteCareerGoals: IFavoriteCareerGoal[];
  helpMessages: IHelpMessage[];
}

const FacultyHomePage: React.FC<IFacultyHomePageProps> = (props: IFacultyHomePageProps) => (
  <div id="faculty-home-page">
    <FacultyPageMenuWidget />
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}><HelpPanelWidget helpMessages={props.helpMessages} /></Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}>
          <FacultyPageAboutMeWidget
            profile={props.profile}
            favoriteInterests={props.favoriteInterests}
            favoriteCareerGoals={props.favoriteCareerGoals}
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

export default FacultyHomePageContainer;
