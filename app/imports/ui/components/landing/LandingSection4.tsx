import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Grid, Header, Loader, Image } from 'semantic-ui-react';
import RadGradLogoText from '../shared/RadGradLogoText';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import styles from './landing-styles';

interface ILandingSection4Props {
  opportunities?: number;
  ready?: boolean;
}

class LandingSection4 extends React.Component<ILandingSection4Props, {}> {
  constructor(props) {
    super(props);
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader active={true}>Getting data</Loader>;
  }

  public renderPage() {
    return (
      <div id="landing-section-4" style={styles['grey-section']}>
        <Container style={styles['landing-section-4, landing-section-6, landing-section-8']}>
          <Grid columns={2} centered={true} padded={true} stackable={true}>
            <Grid.Column>
              <Header as="h1" style={styles['header-text']}>Generate a custom degree experience</Header>
              <p style={styles['header-description']}>
                Based on your degree, career goals, and interests, RadGrad helps you plan what you'll do each
                semester: not just the classes you'll take, but also <em>relevant</em> extracurricular opportunities such as
                hackathons, internships, clubs, and more. RadGrad currently provides you with&nbsp;
                <strong style={styles['inverted-description p > strong, .header-description p > strong']}>{this.props.opportunities}</strong> opportunities to choose from, with more on the way!</p>
              <p style={styles['header-description']}>
                RadGrad recognizes that what you do outside of class is sometimes just as important as what you do in
                it.
              </p>
            </Grid.Column>
            <Grid.Column>
              <Image className="ui bordered rounded image" src="/images/landing/abi-degree-planner.png"/>
            </Grid.Column>
          </Grid>
        </Container>
      </div>
    );

  }
}

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(PublicStats.getCollectionName());
  let key;
  let opportunities;
  if (subscription.ready()) {
    key = PublicStats.opportunitiesTotalKey;
    opportunities = PublicStats.findDoc({ key }).value;
  }
  return {
    ready: subscription.ready(),
    opportunities,
  };
})(LandingSection4);
