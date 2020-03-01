import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const GuidedTourAdvisorDegreePlan = () => (
  <div>
    <Grid container columns={2}>
      <Grid.Column width="ten">
        <a href="/images/guidedtour/guidedtour-degreeplan.png" target="_blank">
          <Image rounded src="/images/guidedtour/guidedtour-degreeplan.png" />
          <p style={styles.p}>Click for full-size image</p>
        </a>
      </Grid.Column>
      <Grid.Column width="six" textAlign="left">
        <Header style={styles.h1}>Collaborative degree planning</Header>

        <p style={styles.p}>Without RadGrad, a CS degree plan could be nothing more than some notes on paper.  RadGrad provides a simple, online representation that focuses on just the computer science part of their university program.  RadGrad augments but does not replace systems like STAR, which must also represent College and University degree requirements.</p>

        <p style={styles.p}>Where RadGrad goes beyond STAR is in its representation of &quot;opportunities&quot;: experiences outside the classroom. Advisors and faculty can add and modify the set of opportunities at any time, and those students whose interests match will be automatically notified by RadGrad that a new opportunity of interest to them is available.</p>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourAdvisorDegreePlan;
