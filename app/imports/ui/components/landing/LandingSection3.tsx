import React from 'react';
import { Container, Grid, Header, Image } from 'semantic-ui-react';
import styles from './landing-styles';
import RadGradLogoText from '../shared/RadGradLogoText';

const headerStyle = { fontSize: '50px', display: 'inline' };
const LandingSection3 = () => (
  <div id="landing-section-3" style={styles['header-section-gray']}>
    <Container textAlign="center">
      <Header as="h1" style={styles['header-text']} textAlign="center">
        Why Use <span style={styles['green-text']}><RadGradLogoText style={headerStyle} />?</span></Header>
      <p style={styles['header-description']}>Computer science is changing all the time, and so your interests and
        career goals might evolve as well.<br />
        RadGrad provides &quot;Explorers&quot; for career goals, interests, courses, opportunities, and more so you can
        stay on top of the latest trends. <br />
      </p>
      <Grid doubling columns={5}>
        <Grid.Column>
          <Image src="/images/landing/home_discover.png" />
          <span style={styles['home-number-label']}><strong>Discover</strong> <br />your interests</span>
        </Grid.Column>
        <Grid.Column>
          <Image src="/images/landing/home_build.png" />
          <span style={styles['home-number-label']}><strong>Build</strong> <br />your community</span>
        </Grid.Column>
        <Grid.Column>
          <Image src="/images/landing/home_strength.png" />
          <span style={styles['home-number-label']}><strong>Strengthen</strong> <br />your preparation</span>
        </Grid.Column>
        <Grid.Column>
          <Image src="/images/landing/home_define.png" />
          <span style={styles['home-number-label']}><strong>Define,</strong>  then <strong>achieve</strong> <br />your career goals</span>
        </Grid.Column>
        <Grid.Column>
          <Image src="/images/landing/home_payit.png" />
          <span style={styles['home-number-label']}><strong>Pay it forward</strong></span>
        </Grid.Column>
      </Grid>
    </Container>
  </div>
);

export default LandingSection3;
