import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const GuidedTourStudentDegreePlan = () => (
  <div>
    <Grid container={true} columns={2}>
      <Grid.Column width={'ten'}>
        <a href="/images/guidedtour/guidedtour-degreeplan.png" target="_blank"><Image rounded={true} src="/images/guidedtour/guidedtour-degreeplan.png"/><p style={styles.p}>Click for full-size image</p></a>
      </Grid.Column>
      <Grid.Column width={'six'} textAlign={'left'}>
        <div>
          <Header style={styles.h1}>Optimize your plan</Header>
          <p style={styles.p}>Now that you have picked a few interests and potential career goals, and discovered which courses and opportunities match, it&apos;s time to design your degree plan.  The degree plan specifies which courses and opportunities you&apos;ll take each semester until you graduate.  RadGrad is designed to help you graduate as quickly and efficiently as possible, with the best possible preparation for life after the diploma.</p>
          <p style={styles.p}>In addition to recommending courses and opportunities, RadGrad also provides warnings when things don&apos;t look right.  For example, RadGrad tells you when you add a course to a semester without having taken the prerequisite, or if your degree plan doesn&apos;t include all of the required courses.</p>
          <p style={styles.p}>In the current competitive job market, just getting a degree isn&apos;t enough to guarantee great job opportunities. RadGrad provides a new metric called ICE to help you develop the complete package of skills and experiences.</p>
          <p style={styles.p}>Let&apos;s look at ICE next.</p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourStudentDegreePlan;
