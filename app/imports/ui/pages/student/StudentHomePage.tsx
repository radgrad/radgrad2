import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentOfInterestWidget from '../../components/student/HomePage/StudentOfInterestWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import GuidedTourStudentHome from '../landing/GuidedTourStudentHome';
import FavoriteInterestsList from '../../components/student/HomePage/StudentFavoriteInterests';
import StudentHomeRecommendedTeasers from '../../components/student/HomePage/StudentHomeRecommendedTeasers';
import StudentHomeGuidedTour from '../../components/student/HomePage/StudentHomeGuidedTour';

const StudentHomePage = () => (
  <div>
    <StudentPageMenuWidget />
    <GuidedTourStudentHome />
    <Container>
      <Grid stackable>
        <Grid.Row>
          <StudentHomeGuidedTour />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={11}>
            <StudentHomeRecommendedTeasers />
          </Grid.Column>
          <Grid.Column width={5}>
            <StudentOfInterestWidget type="opportunities" />
            <FavoriteInterestsList />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <BackToTopButton />
    </Container>
  </div>

);

export default StudentHomePage;
