import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../../pages/landing/guidedtour-style';

const GuidedTourAdvisorWelcome = () => (
  <div>
    <Grid container columns={2}>
      <Grid.Column width="nine">
        <a href="/images/guidedtour/guidedtour-studentconfig.png" target="_blank">
          <Image rounded src="/images/guidedtour/guidedtour-studentconfig.png" />
          <p style={styles.p}>Click for full-size image</p>
        </a>
      </Grid.Column>
      <Grid.Column width="seven" textAlign="left">
        <div>
          <Header style={styles.h1}>Welcome to Computer Science!</Header>
          <p style={styles.p}>
            Advisors assist students in clarifying their life and career goals, developing meaningful educational plans,
            and preparing for productive lives, enlightened citizenship, and life-long learning.
          </p>
          <p style={styles.p}>
            A primary goal of RadGrad is to help advisors do their job better.
          </p>
          <p style={styles.p}>
            Of course, many students might only have a vague idea of the range of interests and career goals in computer
            science, and RadGrad provides an opportunity for the advisor to start this discussion and show them how
            RadGrad enables them to learn more about the field at their own pace.
          </p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourAdvisorWelcome;
