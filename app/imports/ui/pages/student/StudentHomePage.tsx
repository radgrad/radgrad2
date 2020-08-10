import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentOfInterestWidget from '../../old_uidesign/components/student/HomePage/StudentOfInterestWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import GuidedTourStudentHomeWidget from '../landing/GuidedTourStudentHomeWidget';
import StudentHomeFavoriteInterestsList from '../../components/student/HomePage/StudentHomeFavoriteInterestsWidget';
import StudentHomeRecommendedTeasersWidget from '../../components/student/HomePage/StudentHomeRecommendedTeasersWidget';
import StudentHomeBannersWidget from '../../components/student/HomePage/StudentHomeBannersWidget';
import StudentHomeRadGradVideosWidget from '../../components/student/HomePage/StudentHomeRadGradVideosWidget';

const StudentHomePage = () => (
  <div>
    <StudentPageMenuWidget />
    <GuidedTourStudentHomeWidget />
    <Container>
      <Grid stackable>
        <Grid.Row>
          <StudentHomeBannersWidget />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={11}>
            <StudentHomeRecommendedTeasersWidget />
            <StudentHomeRadGradVideosWidget />
          </Grid.Column>
          <Grid.Column width={5}>
            <StudentOfInterestWidget type="opportunities" />
            <StudentHomeFavoriteInterestsList />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <BackToTopButton />
    </Container>
  </div>

);

export default StudentHomePage;
