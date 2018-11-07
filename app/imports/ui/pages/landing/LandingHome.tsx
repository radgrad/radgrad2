import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Card, Container, Grid, Header, Icon, Image, Loader, Segment } from 'semantic-ui-react';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import LandingNavBarContainer from './LandingNavBar';
import LandingSection1 from '../../components/landing/LandingSection1';
import LandingSection2 from '../../components/landing/LandingSection2';
import LandingSection3 from '../../components/landing/LandingSection3';
import LandingSection4 from '../../components/landing/LandingSection4';
import LandingSection5 from '../../components/landing/LandingSection5';
import LandingSection6 from '../../components/landing/LandingSection6';
import LandingSection7 from '../../components/landing/LandingSection7';
import LandingSection8 from '../../components/landing/LandingSection8';
import LandingSection9 from '../../components/landing/LandingSection9';
import Footer from '../../components/landing/Footer';

interface ILandingHomeProps {
  careerGoalNames: string[];
  careerGoals: number;
  courseReviews?: number;
  degrees?: number;
  interests: number;
  levelOne?: number;
  levelTwo?: number;
  levelThree?: number;
  levelFour?: number;
  levelFive?: number;
  levelSix?: number;
  locations?: string[];
  mentors?: number;
  opportunities: number;
  users: number;
  ready?: boolean;
}

/** A simple static component to render some text for the landing page. */
class LandingHome extends React.Component<ILandingHomeProps> {

  constructor(props) {
    super(props);
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader active={true}>Getting data</Loader>;
  }

  public renderPage() {
    return (
      <div>
        <LandingNavBarContainer/>
        <LandingSection1/>
        <LandingSection2 careerGoals={this.props.careerGoals} interests={this.props.interests}
                         opportunities={this.props.opportunities} users={this.props.users}/>
        <LandingSection3 careerGoals={this.props.careerGoals} degrees={this.props.degrees}
                         interests={this.props.interests}/>
        <LandingSection4 opportunities={this.props.opportunities}/>
        <LandingSection5/>
        <LandingSection6 levelOne={this.props.levelOne} levelTwo={this.props.levelTwo}
                         levelThree={this.props.levelThree} levelFour={this.props.levelFour}
                         levelFive={this.props.levelFive} levelSix={this.props.levelSix}/>
        <LandingSection7 careerGoalNames={this.props.careerGoalNames}/>
        <LandingSection8 courseReviews={this.props.courseReviews} locations={this.props.locations}
                         mentors={this.props.mentors}/>
        <LandingSection9/>
        <Footer/>
      </div>
    );
  }
}

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const LandingHomeContainer = withTracker(() => {
  const subscription = Meteor.subscribe(PublicStats.getCollectionName());
  let key: string;
  let careerGoalNames: string[];
  let careerGoals: number;
  let courseReviews: number;
  let degrees: number;
  let interests: number;
  let levelOne: number;
  let levelTwo: number;
  let levelThree: number;
  let levelFour: number;
  let levelFive: number;
  let levelSix: number;
  let locations: string[];
  let mentors: number;
  let opportunities: number;
  let users: number;
  if (subscription.ready() && !Meteor.isAppTest) {
    key = PublicStats.careerGoalsListKey;
    careerGoalNames = PublicStats.findDoc({ key }).value;
    key = PublicStats.careerGoalsTotalKey;
    careerGoals = PublicStats.findDoc({ key }).value;
    key = PublicStats.desiredDegreesTotalKey;
    degrees = PublicStats.findDoc({ key }).value;
    key = PublicStats.interestsTotalKey;
    interests = PublicStats.getCollection().findOne({ key }).value;
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
    key = PublicStats.opportunitiesTotalKey;
    opportunities = PublicStats.findDoc({ key }).value;
    key = PublicStats.courseReviewsTotalKey;
    courseReviews = PublicStats.getCollection().findOne({ key }).value;
    key = PublicStats.usersMentorsTotalKey;
    mentors = PublicStats.getCollection().findOne({ key }).value;
    key = PublicStats.usersMentorsLocationsKey;
    locations = PublicStats.getCollection().findOne({ key }).value;
    key = 'usersTotal';
    users = PublicStats.findDoc({ key }).value;
  }
  return {
    ready: subscription.ready(),
    careerGoals,
    courseReviews,
    degrees,
    interests,
    levelOne,
    levelTwo,
    levelThree,
    levelFour,
    levelFive,
    levelSix,
    locations,
    mentors,
    opportunities,
    users,
  };
})(LandingHome);

export default LandingHomeContainer;
