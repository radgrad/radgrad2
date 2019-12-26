import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const GuidedTourFacultySetUp = () => (
  <div>
    <Grid container columns={2}>
      <Grid.Column width="nine">
        <a href="/images/guidedtour/guidedtour-faculty-profile.png" target="_blank">
          <Image rounded src="/images/guidedtour/guidedtour-faculty-profile.png" />
          <p style={styles.p}>Click for full-size image</p>
        </a>
      </Grid.Column>
      <Grid.Column width="seven" textAlign="left">
        <div>
          <Header style={styles.h1}>Provide your profile</Header>
          <p style={styles.p}>To start using RadGrad, an advisor or RadGrad admin must create a faculty account for you. Then you can login using your regular UH credentials.</p>
          <p style={styles.p}>It&apos;s useful to specify your disciplinary areas (&quot;interests&quot;) as well as career goals for which you have some expertise. Your profile picture will then be associated with these interests and career goals, and students will know to come to you for advising.</p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourFacultySetUp;
