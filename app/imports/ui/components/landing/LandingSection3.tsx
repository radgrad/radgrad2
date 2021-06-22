import React from 'react';
import { Container, Grid, Header, Image } from 'semantic-ui-react';
import styles from './utilities/landing-styles';
import RadGradLogoText from '../shared/RadGradLogoText';

interface LandingSection3Props {
  landingSubject: string;
  instanceName: string;
}

const headerStyle = { fontSize: '50px', display: 'inline' };
const LandingSection3: React.FC<LandingSection3Props> = ({ instanceName, landingSubject }) => (
  <div id="landing-section-3" style={styles['header-section-gray']}>
    <Container textAlign="center">
      <Header as="h1" style={styles['header-text']} textAlign="center">
        Why Use{' '}
        <span style={styles['green-text']}>
          <RadGradLogoText style={headerStyle} />?
        </span>
      </Header>
      <p style={styles['header-description']}>
        {`${landingSubject}`} is changing all the time, and so your interests and career goals might evolve as well. Here are ways that RadGrad can help:
      </p>
      <Grid doubling columns={2}>
        <Grid.Column>
          <div style={styles['landing-number-column']}>
            <Image centered src="/images/landing/home_discover.png" />
            <Header>Discover your interests</Header>
            <p>Learn about the latest topics, courses, and
              opportunities in {`${landingSubject}`.toLowerCase()}.</p>
          </div>
        </Grid.Column>
        <Grid.Column>
          <div style={styles['landing-number-column']}>
            <Image centered src="/images/landing/home_build.png" />
            <Header>Build your community</Header>
            <p>RadGrad helps you connect with like-minded students and faculty members.</p>
          </div>
        </Grid.Column>
        <Grid.Column>
          <div style={styles['landing-number-column']}>
            <Image centered src="/images/landing/home_strength.png" />
            <Header>Strengthen your preparation</Header>
            <p>RadGrad recommends courses and opportunities that are related to your interests and career goals.</p>
          </div>
        </Grid.Column>
        <Grid.Column>
          <div style={styles['landing-number-column']}>
            <Image centered src="/images/landing/home_define.png" />
            <Header>Define, then achieve your goals</Header>
            <p>RadGrad connects you with interesting and useful projects, clubs, internships, online learning, events, and more.</p>
          </div>
        </Grid.Column>
      </Grid>
    </Container>
  </div>
);

export default LandingSection3;
