import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Container, Grid, Header, Icon, Image, Label, Loader, Segment } from 'semantic-ui-react';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import styles from './landing-styles';

interface ILandingSection6Props {
  levelOne?: number;
  levelTwo?: number;
  levelThree?: number;
  levelFour?: number;
  levelFive?: number;
  levelSix?: number;
  ready?: boolean;
}

class LandingSection6 extends React.Component<ILandingSection6Props, {}> {
  constructor(props) {
    super(props);
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader active={true}>Getting data</Loader>;
  }

  public renderPage() {
    const marginStyle = { margin: 21 };
    return (
      <div className="grey-section" id="landing-section-6" style={styles['landing-section-4, landing-section-6, landing-section-8']}>
        <Container className="ui container">
          <Grid columns={2} centered={true} padded={true} stackable={true}>

            <Grid.Column textAlign={'center'}>
              <Grid columns={3}>
                <Grid.Column>
                  <Image size={'small'} src="/images/level-icons/radgrad-level-1-icon.png"/>
                </Grid.Column>
                <Grid.Column className="column">
                  <Image size={'small'} src="/images/level-icons/radgrad-level-2-icon.png"/>
                </Grid.Column>
                <Grid.Column className="column">
                  <Image size={'small'} src="/images/level-icons/radgrad-level-3-icon.png"/>
                </Grid.Column>
              </Grid>

              <Header as="h1" style={styles['header-text']}>Level up</Header>
              <div style={styles['header-description']}>
                <p>
                  The RadGrad path to an improved degree experience is long and challenging. To recognize stages in your
                  progress, RadGrad defines six levels of achievement: white, yellow, green, blue, brown and black.
                </p>
                <p>
                  Right now, there are <strong>{this.props.levelOne}</strong> student(s) at Level One,&nbsp;
                  <strong>{this.props.levelTwo}</strong> at Level Two, <strong>{this.props.levelThree}</strong> at Level
                  Three, <strong>{this.props.levelFour}</strong> at Level
                  Four, <strong>{this.props.levelFive}</strong> at
                  Level Five, and <strong>{this.props.levelSix}</strong> at Level Six.
                </p>
                <p>
                  Once you achieve a level, the corresponding badge appears in your profile and is visible to other
                  community members. In addition, your advisor will give you a laptop sticker representing your level.
                  Congratulations, grasshopper!
                </p>
              </div>

              <Grid columns={3} style={marginStyle}>
                <Grid.Column>
                  <Image size={'small'} src="/images/level-icons/radgrad-level-4-icon.png"/>
                </Grid.Column>
                <Grid.Column>
                  <Image size={'small'} src="/images/level-icons/radgrad-level-5-icon.png"/>
                </Grid.Column>
                <Grid.Column>
                  <Image size={'small'} src="/images/level-icons/radgrad-level-6-icon.png"/>
                </Grid.Column>
              </Grid>
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
  let levelOne;
  let levelTwo;
  let levelThree;
  let levelFour;
  let levelFive;
  let levelSix;
  if (subscription.ready()) {
    key = PublicStats.levelOneTotalKey;
    levelOne = PublicStats.getCollection().findOne({ key }).value;
    key = PublicStats.levelTwoTotalKey;
    levelTwo = PublicStats.findDoc({ key }).value;
    key = PublicStats.levelThreeTotalKey;
    levelThree = PublicStats.findDoc({ key }).value;
    key = PublicStats.levelFourTotalKey;
    levelFour = PublicStats.findDoc({ key }).value;
    key = PublicStats.levelFiveTotalKey;
    levelFive = PublicStats.findDoc({ key }).value;
    key = PublicStats.levelSixTotalKey;
    levelSix = PublicStats.findDoc({ key }).value;
  }
  return {
    ready: subscription.ready(),
    levelOne,
    levelTwo,
    levelThree,
    levelFour,
    levelFive,
    levelSix,
  };
})(LandingSection6);
