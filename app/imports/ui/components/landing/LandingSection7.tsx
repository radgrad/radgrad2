import React from 'react';
import { Container, Grid, Header, Image } from 'semantic-ui-react';
import styles from './landing-styles';

interface ILandingSection7Props {
  careerGoalNames: string;
}

const LandingSection7 = (props: ILandingSection7Props) => (
  <div id="landing-section-7" style={styles['inverted-section']}>
    <Container>
      <Grid
        columns={2}
        centered
        padded
        stackable
        style={styles['landing-section-3 .grid, landing-section-4 .grid, landing-section-5 .grid, landing-section-6 .container, landing-section-7 .grid, landing-section-8 .container, landing-section-9 .container']}
      >

        <Grid.Column>
          <Header as="h1" style={styles['inverted-header']}>Discover new directions</Header>
          <p style={styles['inverted-description']}>
            Computer science is changing all the time, and so your interests and career goals might evolve as well.
          </p>
          <p style={styles['inverted-description']}>
            RadGrad provides &quot;Explorers&quot; for career goals, interests, degrees, and more so you can stay on top of
            the latest trends. For example, RadGrad&apos;s career goals
            include: <strong style={styles['green-text']}>{props.careerGoalNames}</strong>.
          </p>
        </Grid.Column>

        <Grid.Column>
          <Image rounded src="/images/landing/abi-explorer-career-goals.png" />
        </Grid.Column>
      </Grid>
    </Container>
  </div>
);

export default LandingSection7;
