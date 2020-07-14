import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentOfInterestWidget from '../../components/student/StudentOfInterestWidget';
import StudentTeaserWidget from '../../components/student/StudentTeaserWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import GuidedTourStudentContainer from '../landing/GuidedTourStudent';

const StudentHomePage = () => (
  <div>
    <StudentPageMenuWidget />
    <GuidedTourStudentContainer />
    <Container>
      <Grid stackable divided="vertically">
        <Grid.Row>
          <Grid.Column width={5} padded className="action-box action-box1" rounded>
            <h2>Develop your ability to innovate and to have professional experiences</h2>
            <p>Be a well-rounded graduate who is attractive to employers and/or graduate programs</p>
          </Grid.Column>
          <Grid.Column width={5} padded className="action-box action-box-padded action-box2">
            <h2>Explore Courses and Get Useful Information</h2>
            <p>The Courses Explorer enables you to take a deep dive into each of the courses associated with the degree program.</p>
          </Grid.Column>
          <Grid.Column width={5} padded className="action-box action-box3">
            <h2>Specify Your Career Goals</h2>
            <p>The set of career goals are curated by the faculty to represent a good selection of the most promising career paths.</p>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={11}>
            <StudentTeaserWidget />
          </Grid.Column>
          <Grid.Column width={5}>
            <StudentOfInterestWidget type="opportunities" />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <BackToTopButton />
    </Container>
  </div>

);

export default StudentHomePage;
