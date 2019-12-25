import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

interface IMentorProps {
  mentors: number;
  mentorLocations: string;
}
const GuidedTourStudentMentor = (props: IMentorProps) => (
  <div>
    <Grid container columns={2}>
      <Grid.Column width="ten">
        <a href="/images/guidedtour/guidedtour-mentorspace.png" target="_blank">
          <Image rounded src="/images/guidedtour/guidedtour-mentorspace.png" />
          <p style={styles.p}>Click for full-size image</p>
        </a>
      </Grid.Column>
      <Grid.Column width="six" textAlign="left">
        <div>
          <Header style={styles.h1}>Rocket through MentorSpace</Header>
          <p style={styles.p}>
In the MentorSpace page, you will find mentors in a variety of job areas ready to answer your questions about life after your degree.  RadGrad currently has
            <strong style={styles.strong}>{props.mentors}</strong>
            {' '}
mentors, working in locations including:
            <strong style={styles.strong}>{props.mentorLocations}</strong>
.  Your questions are anonymous so you aren&apos;t put on the spot.
          </p>
          <p style={styles.p}>After you graduate, if you want to pay it forward, you can contact a RadGrad admin and ask to become a mentor yourself.</p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourStudentMentor;
