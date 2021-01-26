import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import StudentPageMenu from '../../components/student/StudentPageMenu';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentAboutMeWidget from '../../components/student/about-me/StudentAboutMeWidget';
import { Users } from '../../../api/user/UserCollection';
import { FavoriteCareerGoal, FavoriteInterest, StudentProfile } from '../../../typings/radgrad';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';

interface StudentAboutMePageProps {
  profile: StudentProfile;
  favoriteCareerGoals: FavoriteCareerGoal[];
  favoriteInterests: FavoriteInterest[];
}

const StudentAboutMePage: React.FC<StudentAboutMePageProps> = ({ profile, favoriteCareerGoals, favoriteInterests }) => (
  <div id="student-about-me-page">
    <StudentPageMenu />
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={12}>
            <StudentAboutMeWidget profile={profile} favoriteCareerGoals={favoriteCareerGoals} favoriteInterests={favoriteInterests} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
    <BackToTopButton />
  </div>
);

const StudentAboutMePageContainer = withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username) as StudentProfile;
  const favoriteCareerGoals = FavoriteCareerGoals.findNonRetired({ userID: profile.userID });
  const favoriteInterests = FavoriteInterests.findNonRetired({ userID: profile.userID });
  return {
    profile,
    favoriteCareerGoals,
    favoriteInterests,
  };
})(StudentAboutMePage);

export default StudentAboutMePageContainer;
