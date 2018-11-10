import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Container, Grid, Header, Icon, Image, Loader, Segment } from 'semantic-ui-react';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import styles from './landing-styles';

interface ILandingSection3Props {
  careerGoals: string;
  interests: string;
  degrees: string;
}

const LandingSection3 = (props: ILandingSection3Props) => (
  <div id="landing-section-3" style={styles['inverted-section']}>
    <Container>
      <Grid textAlign={'center'} padded={true} stackable={true} columns={2} style={styles.container}>
        <Grid.Column>
          <Image rounded={true} src="/images/landing/abi-about-me.png"/>
        </Grid.Column>
        <Grid.Column>
          <Header as="h1" style={styles['inverted-header']}>Specify your degree, career goals, and
            interests</Header>
          <p style={styles['inverted-description']}>Getting started with RadGrad is easy. Just meet with your
            advisor, and they will set up your account and answer your questions.</p>

          <p style={styles['inverted-description']}>To start, you'll select one of
            the <strong>{props.degrees}</strong> <a href="/">degree programs</a>, one out
            of <strong>{props.careerGoals}</strong> <a href="/">career directions</a>, and a few of
            the <strong>{props.interests}</strong> <a href="/">interest areas</a>. Don't worry, you can change
            them later!</p>
        </Grid.Column>
      </Grid>
    </Container>
  </div>
);

export default LandingSection3;
