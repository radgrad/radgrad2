import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Container, Grid, Header, Icon, Image, Label, Loader, Segment } from 'semantic-ui-react';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import styles from './landing-styles';

interface ILandingSection8Props {
  ready?: boolean;
  courseReviews?: number;
  mentors?: number;
  locations?: string[];
}

class LandingSection8 extends React.Component<ILandingSection8Props, {}> {
  constructor(props) {
    super(props);
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader active={true}>Getting data</Loader>;
  }

  public renderPage() {
    return (
      <div id="landing-section-8" style={styles['grey-section']}>
        <Container style={styles['landing-section-4, landing-section-6, landing-section-8']}>
          <Grid centered={true} padded={true} >
            <Grid.Column textAlign={'center'}>
              <Header as="h1" style={styles['header-text']}>Pay it forward</Header>
              <p style={styles['header-description']}>
                RadGrad offers opportunities for students to give back to their academic community both during their
                degree program and after they graduate.
              </p>
              <p style={styles['header-description']}>
                During your time as a student, you can provide advice about courses you've already taken to those coming
                after you. Students have contributed <strong style={styles['green-text']}>{this.props.courseReviews}</strong> course reviews so far.
              </p>
              <p style={styles['header-description']}>
                After you graduate, you can become a mentor, and answer student questions about life after graduation
                and how to best prepare for it. We have <strong style={styles['green-text']}>{this.props.mentors}</strong> mentors from locations
                including: <strong style={styles['green-text']}>{this.props.locations}</strong>.
              </p>
            </Grid.Column>
          </Grid>

          <Grid columns={2} centered={true} padded={true} stackable={true}>
            <Grid.Column>
              <Image bordered={true} rounded={true} src="/images/landing/abi-course-reviews.png"/>
            </Grid.Column>

            <Grid.Column>
              <Image bordered={true} rounded={true} src="/images/landing/abi-mentor-space.png"/>
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
  let courseReviews;
  let mentors;
  let locations;
  if (subscription.ready()) {
    key = PublicStats.courseReviewsTotalKey;
    courseReviews = PublicStats.getCollection().findOne({ key }).value;
    key = PublicStats.usersMentorsTotalKey;
    mentors = PublicStats.getCollection().findOne({ key }).value;
    key = PublicStats.usersMentorsLocationsKey;
    locations = PublicStats.getCollection().findOne({ key }).value;
  }
  return {
    ready: subscription.ready(),
    courseReviews,
    locations,
    mentors,
  };
})(LandingSection8);
