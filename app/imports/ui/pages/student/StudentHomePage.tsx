import React from 'react';
import { Grid, Container, Card, Button } from 'semantic-ui-react';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentOfInterestWidget from '../../components/student/HomePage/StudentOfInterestWidget';
import StudentTeaserWidget from '../../components/student/HomePage/StudentTeaserWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import GuidedTourStudentHome from '../landing/GuidedTourStudentHome';
import FavoriteInterestsList from '../../components/student/HomePage/FavoriteInterests';

const bg1 = { backgroundColor: '#6fbe44' };
const bg2 = { backgroundColor: '#2f9276' };
const bg3 = { backgroundColor: '#106735' };

const StudentHomePage = () => (
  <div>
    <StudentPageMenuWidget />
    <GuidedTourStudentHome />
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column>
            <Card.Group itemsPerRow={3}>
              <Card href="#" style={bg1}>
                <Card.Content>
                  <div className="action-box action-box1">
                    <h2>Develop your ability to innovate and to have experiences</h2>
                    <p>Be a well-rounded graduate who is attractive to employers and/or graduate programs</p>
                    <Button basic inverted color="yellow">Learn More</Button>
                  </div>
                </Card.Content>
              </Card>
              <Card href="#" style={bg2}>
                <Card.Content>
                  <div className="action-box action-box2">
                    <h2>Explore Courses and Get Useful Information</h2>
                    <p>It enables you to take a deep dive into each of the courses associated with the degree program.</p>
                    <Button basic inverted color="yellow">Learn More</Button>
                  </div>
                </Card.Content>
              </Card>
              <Card href="#" style={bg3}>
                <Card.Content>
                  <div className="action-box action-box3">
                    <h2>Specify Your Career Goals</h2>
                    <p>The set of career goals are curated by the faculty to represent a good selection of the most promising career paths.</p>
                    <Button basic inverted color="yellow">Learn More</Button>
                  </div>
                </Card.Content>
              </Card>
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={11}>
            <StudentTeaserWidget />
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
