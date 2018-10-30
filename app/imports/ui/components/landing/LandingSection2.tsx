import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Loader } from 'semantic-ui-react';
import RadGradLogoTextQ from '../shared/RadGradLogoTextQ';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import styles from './landing-styles';

interface ILandingSection2Props {
  careerGoals?: number;
  interests?: number;
  opportunities?: number;
  users?: number;
  ready?: boolean;
}

class LandingSection2 extends React.Component<ILandingSection2Props, {}> {
  constructor(props) {
    super(props);
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader active={true}>Getting data</Loader>;
  }

  public renderPage() {
    const noMarginTopStyle = { marginTop: '0px' };
    const inlineStyle = { display: 'flex' };
    return (
      <div style={styles['header-section']}>
        <Grid stackable={true}>
          <Grid.Column width={3}/>
          <Grid.Column width={5} textAlign={'right'}>
            <Header as="h1" style={styles['header-text']}>Why use <RadGradLogoTextQ/></Header>
            <p style={styles['header-description']}>
              <b>Discover</b> your interests. <br/>
              <b>Build</b> your community. <br/>
              <b>Strengthen</b> your preparation. <br/>
              <b>Define</b>, then <b>achieve</b> your career goals. <br/>
              <b>Pay it forward.</b> <br/>
            </p>
          </Grid.Column>
          <Grid.Column width={5} verticalAlign={'middle'}>
            <div className="ui huge horizontal statistics landing-stats" style={noMarginTopStyle}>
              <div className="green statistic" style={styles['landing-stats > .statistic']}>
                <div className="value">
                  {this.props.careerGoals}
                </div>
                <div className="label">
                  <a href="/">Career Goals</a>
                </div>
              </div>
              <div className="green statistic">
                <div className="value">
                  {this.props.interests}
                </div>
                <div className="label">
                  <a href="/">Interests</a>
                </div>
              </div>
              <div className="green statistic">
                <div className="value">
                  {this.props.opportunities}
                </div>
                <div className="label">
                  <a href="/">Opportunities</a>
                </div>
              </div>
              <div className="green statistic">
                <div className="value">
                  {this.props.users}
                </div>
                <div className="label">
                  Students, Faculty, Mentors
                </div>
              </div>
            </div>
          </Grid.Column>
          <Grid.Column width={3}/>
        </Grid>
      </div>
    );
  }
}

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(PublicStats.getCollectionName());
  let key;
  let interests;
  let opportunities;
  let users;
  let careerGoals;
  if (subscription.ready()) {
    key = PublicStats.interestsTotalKey;
    interests = PublicStats.getCollection().findOne({ key }).value;
    key = PublicStats.opportunitiesTotalKey;
    opportunities = PublicStats.findDoc({ key }).value;
    key = 'usersTotal';
    users = PublicStats.findDoc({ key }).value;
    key = 'careerGoalsTotal';
    careerGoals = PublicStats.findDoc({ key }).value;
  }
  return {
    ready: subscription.ready(),
    careerGoals,
    interests,
    opportunities,
    users,
  };
})(LandingSection2);
