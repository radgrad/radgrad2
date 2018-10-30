import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Container, Grid, Header, Icon, Image, Label, Loader, Segment } from 'semantic-ui-react';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import styles from './landing-styles';

interface ILandingSection7Props {
  ready?: boolean;
  careerGoals?: string[];
}

class LandingSection7 extends React.Component<ILandingSection7Props, {}> {
  constructor(props) {
    super(props);
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader active={true}>Getting data</Loader>;
  }

  public renderPage() {
    return (
      <div id="landing-section-7" style={styles['inverted-section']}>
        <Container>
          <Grid columns={2} centered={true} padded={true} stackable={true} style={styles['landing-section-3 .grid, landing-section-4 .grid, landing-section-5 .grid, landing-section-6 .container, landing-section-7 .grid, landing-section-8 .container, landing-section-9 .container']}>

            <Grid.Column>
              <Header as="h1" style={styles['inverted-header']}>Discover new directions</Header>
              <p style={styles['inverted-description']}>
                Computer science is changing all the time, and so your interests and career goals might evolve as well.
              </p>
              <p style={styles['inverted-description']}>
                RadGrad provides "Explorers" for career goals, interests, degrees, and more so you can stay on top of
                the latest trends. For example, RadGrad's career goals
                include: <strong style={styles['green-text']}>{this.props.careerGoals}</strong>.
              </p>
            </Grid.Column>

            <Grid.Column>
              <Image rounded={true} src="/images/landing/abi-explorer-career-goals.png"/>
            </Grid.Column>
          </Grid>
        </Container>
      </div>

    );
  }
}

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  const subscription = Meteor.subscribe(PublicStats.getCollectionName());
  let key;
  let careerGoals;
  if (subscription.ready()) {
    key = PublicStats.careerGoalsListKey;
    careerGoals = PublicStats.getCollection().findOne({ key }).value;
  }
  return {
    ready: subscription.ready(),
    careerGoals,
  };
})(LandingSection7);
