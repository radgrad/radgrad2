import React from 'react';
import { Container, Grid, Header, Image } from 'semantic-ui-react';
import styles from './landing-styles';

interface ILandingSection8Props {
  courseReviews: string;
  mentors: string;
  locations: string;
}

const LandingSection8 = (props: ILandingSection8Props) => (
  <div id="landing-section-8" style={styles['header-section']}>
    <Container style={styles['landing-section-4, landing-section-6, landing-section-8']}>
      <Grid centered padded>
        <Grid.Column textAlign="center">
          <Header as="h1" style={styles['header-text']}>Pay it forward</Header>
          <p style={styles['header-description']}>
            RadGrad offers opportunities for students to give back to their academic community both during their
            degree program and after they graduate.
          </p>
          <p style={styles['header-description']}>
            During your time as a student, you can provide advice about courses you&apos;ve already taken to those
            coming after you. Students have contributed
            <strong style={styles['green-text']}> {props.courseReviews}</strong> course reviews so far.
          </p>
          <p style={styles['header-description']}>
            After you graduate, you can become a mentor, and answer student questions about life after graduation
            and how to best prepare for it. We have
            <strong style={styles['green-text']}> {props.mentors}</strong> mentors from locations including:
            <strong style={styles['green-text']}> {props.locations}</strong>.
          </p>
        </Grid.Column>
      </Grid>

      <Grid columns={2} centered padded stackable>
        <Grid.Column>
          <Image bordered rounded src="/images/landing/abi-course-reviews.png" />
        </Grid.Column>

        <Grid.Column>
          <Image bordered rounded src="/images/landing/abi-mentor-space.png" />
        </Grid.Column>

      </Grid>
    </Container>
  </div>
);

export default LandingSection8;
