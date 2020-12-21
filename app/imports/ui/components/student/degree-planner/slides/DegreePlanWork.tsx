import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../../pages/landing/utilities/guidedtour-style';

const DegreePlanWork: React.FC = () => (
  <div>
    <Grid container stackable>
      <Grid.Row centered>
        <Grid.Column width={1} />
        <Grid.Column width={5}>
          <Image rounded size="large" src="/images/help/degree-planner-main.jpg" />
        </Grid.Column>
        <Grid.Column width={10}>
          <Header style={styles.h1}>Make the Degree Planner Work for You!</Header>
          <p style={styles.p}>The Degree Planner helps you organize your ICS Degree experience on a semester-by-semester basis. You can plan the courses you need to satisfy your chosen degree plan as well as the the extra-curricular opportunities that provide you with real-world experience and chances to innovate outside the classroom.</p>
          <p style={styles.p}>In terms of ICE, courses earn you Competency points, while opportunities earn you Innovation and Experience points. All three are critical to becoming a well-rounded graduate who is most attractive to employers and graduate schools!</p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default DegreePlanWork;
