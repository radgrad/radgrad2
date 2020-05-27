import React from 'react';
import { Container, Grid, Header, Image } from 'semantic-ui-react';
import styles from './landing-styles';

interface ILandingSection4Props {
  opportunities: string;
}

const LandingSection4 = (props: ILandingSection4Props) => (
  <div id="landing-section-4" style={styles['header-section']}>
    <Container style={styles['landing-section-4, landing-section-6, landing-section-8']}>
      <Grid columns={2} centered padded stackable>
        <Grid.Column>
          <Header as="h1" style={styles['header-text']}>Generate a custom degree experience</Header>
          <p style={styles['header-description']}>
            Based on your academic plan, career goals, and interests, RadGrad helps you plan what you&apos;ll do each
            semester: not just the classes you&apos;ll take, but also <em>relevant</em> extracurricular opportunities
            such as hackathons, internships, clubs, and more. RadGrad currently provides you with&nbsp;
            <strong style={styles['inverted-description p > strong, .header-description p > strong']}>
              {props.opportunities}
            </strong>
            {' '}opportunities to choose from, with more on the way!
          </p>
          <p style={styles['header-description']}>
            RadGrad recognizes that what you do outside of class is sometimes just as important as what you do in it.
          </p>
        </Grid.Column>
        <Grid.Column>
          <Image className="ui bordered rounded image" src="/images/landing/abi-degree-planner.png" />
        </Grid.Column>
      </Grid>
    </Container>
  </div>
);

export default LandingSection4;
