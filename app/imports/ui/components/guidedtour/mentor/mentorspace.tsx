import * as React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const GuidedTourMentorMentorSpace = () => (
  <div>
    <Grid container={true} columns={2}>
      <Grid.Column width={'nine'}>
        <a href="/images/guidedtour/guidedtour-mentor-mentorspace.png" target="_blank"><Image rounded={true}
                                                                                              src="/images/guidedtour/guidedtour-mentor-mentorspace.png"/>
          <p style={styles.p}>Click for full-size image</p></a>
      </Grid.Column>
      <Grid.Column width={'seven'} textAlign={'left'}>
        <div>
          <Header style={styles.h1}>MentorSpace</Header>
          <p style={styles.p}>RadGrad provides an area called &quot;MentorSpace&quot; to make your contributions as
            efficient and effective as possible.</p>
          <p style={styles.p}>Students can submit questions to a RadGrad administrator, and if appropriate they will be
            posted in the MentorSpace area. One or more mentors can answer each question, providing students with a
            variety of perspectives on issues of interest to them.</p>
          <p style={styles.p}>Questions and answers persist as long as they are relevant, which means your advice can be
            used by hundreds of students over multiple years.</p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourMentorMentorSpace;
