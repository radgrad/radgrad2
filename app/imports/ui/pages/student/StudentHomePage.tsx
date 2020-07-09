import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import BackToTopButton from '../../components/shared/BackToTopButton';
import styles from '../../../../client/style';
import StudentOfInterestWidget from '../../components/student/StudentOfInterestWidget';
import StudentTeaserWidget from '../../components/student/StudentTeaserWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';

const StudentHomePage = () => (
  <div>
    <StudentPageMenuWidget />
    <Container>
      <Grid stackable divided="vertically">
        <Grid.Row columns={3}>
          <Grid.Column style={styles['action-box']}>aaa</Grid.Column>
          <Grid.Column style={styles['action-box']}>bbb</Grid.Column>
          <Grid.Column style={styles['action-box']}>ccc</Grid.Column>
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
