import React from 'react';
import { Container, Grid, Header, Image } from 'semantic-ui-react';
import styles from './utilities/landing-styles';
import RadGradLogoText from '../shared/RadGradLogoText';

interface LandingSection3Props {
  landingSubject: string;
}

const headerStyle = { fontSize: '50px', display: 'inline' };
const LandingSection3: React.FC<LandingSection3Props> = ({ landingSubject }) => (
  <div id="landing-section-3" style={styles['header-section-gray']}>
    <Container textAlign="center">
      <Header as="h1" style={styles['header-text']} textAlign="center">
        Why Use{' '}
        <span style={styles['green-text']}>
          <RadGradLogoText style={headerStyle} />?
        </span>
      </Header>
      <p style={styles['header-description']}>
        {`${landingSubject}`} is changing all the time, and so your interests and career goals might evolve as well.
        <br />
        RadGrad provides &quot;Explorers&quot; for <a href="/#/explorer/career-goals">career goals</a>, <a
        href="/#/explorer/interests">interests</a>, <a href="/#/explorer/courses">courses</a>, <a
        href="/#/explorer/opportunities">opportunities</a>, and more so you can stay on top of the latest trends. <br />
      </p>
      <Grid doubling columns={2}>
        <Grid.Column>
          <div style={styles['landing-number-column']}>
            <Image centered src="/images/landing/home_discover.png" />
            <Header>Discover your interests</Header>
            <p>Learn about the latest {`${landingSubject}`.toLowerCase()} interest areas, courses, and
              opportunities.</p>
          </div>
        </Grid.Column>
        <Grid.Column>
          <div style={styles['landing-number-column']}>
            <Image centered src="/images/landing/home_build.png" />
            <Header>Build your community</Header>
            <p>Each interest displays students, faculty members, and alumni that have choosen them.</p>
          </div>
        </Grid.Column>
        <Grid.Column>
          <div style={styles['landing-number-column']}>
            <Image centered src="/images/landing/home_strength.png" />
            <Header>Strengthen your preparation</Header>
            <p>RadGrad will recommend courses and opportunities that are directly related to your interests and career goals.</p>
          </div>
        </Grid.Column>
        <Grid.Column>
          <div style={styles['landing-number-column']}>
            <Image centered src="/images/landing/home_define.png" />
            <Header>Define,then achieve your goals</Header>
            <p>RadGrad helps you reach beyond the classroom through opportunities. These include projects, clubs, internships, online learning, and events.</p>
          </div>
        </Grid.Column>
      </Grid>
    </Container>
  </div>
);

export default LandingSection3;
