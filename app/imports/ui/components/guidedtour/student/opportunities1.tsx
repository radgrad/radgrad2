import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const signImage = { marginBottom: 0 };

const GuidedTourStudentOpportunities = () => (
  <div>
    <Grid container>
      <Grid.Column width={1} />
      <Grid.Column width={5}>
        <Image
          style={signImage}
          rounded
          src="/images/guidedtour/opportunity_sign.png"
        />
      </Grid.Column>
      <Grid.Column width={8} textAlign="left">
        <Image
          src="/images/guidedtour/opportunity_circles.png"
        />
        <Header style={styles.h1}>Gain Innovation and Experience by taking advantage of Opportunities</Header>
        <p style={styles.p}>This page presents a curated list of Opportunities that the faculty believe will complement existing courses and increase your attractiveness to future employers and graduate programs.
        </p>
      </Grid.Column>
      <Grid.Column width={2} />
    </Grid>
  </div>
);

export default GuidedTourStudentOpportunities;
