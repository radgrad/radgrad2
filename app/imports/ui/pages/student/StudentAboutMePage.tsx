import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentAboutMeWidget from '../../components/student/about-me/StudentAboutMeWidget';
import { Users } from '../../../api/user/UserCollection';
import {
  FavoriteAcademicPlan,
  FavoriteCareerGoal,
  FavoriteInterest,
  StudentProfile,
} from '../../../typings/radgrad';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';

interface StudentAboutMePageProps {
  profile: StudentProfile;
  favoriteCareerGoals: FavoriteCareerGoal[];
  favoriteInterests: FavoriteInterest[];
  favoriteAcademicPlans: FavoriteAcademicPlan[];
}

const StudentAboutMePage: React.FC<StudentAboutMePageProps> = ({ profile, favoriteCareerGoals, favoriteAcademicPlans, favoriteInterests }) => (
  <div id="student-about-me-page">
    <StudentPageMenuWidget />
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={2} />
          <Grid.Column width={12}>
            <StudentAboutMeWidget
              profile={profile}
              favoriteCareerGoals={favoriteCareerGoals}
              favoriteInterests={favoriteInterests}
              favoriteAcademicPlans={favoriteAcademicPlans}
            />
          </Grid.Column>
          <Grid.Column width={2} />
        </Grid.Row>
      </Grid>
    </Container>
    <BackToTopButton />
  </div>
);

const StudentAboutMePageContainer = withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username) as StudentProfile;
  const favoriteAcademicPlans = FavoriteAcademicPlans.findNonRetired({ studentID: profile.userID });
  const favoriteCareerGoals = FavoriteCareerGoals.findNonRetired({ userID: profile.userID });
  const favoriteInterests = FavoriteInterests.findNonRetired({ userID: profile.userID });
  return {
    profile,
    favoriteAcademicPlans,
    favoriteCareerGoals,
    favoriteInterests,
  };
})(StudentAboutMePage);

export default StudentAboutMePageContainer;
