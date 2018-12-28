import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, List, Loader, Segment } from 'semantic-ui-react';
import Slider from 'react-slick';
import styles from './guidedtour-style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LandingFooter from '../../components/landing/LandingFooter';
import WhyRadGrad from '../../components/guidedtour/student/why-radgrad';
import SetUp from '../../components/guidedtour/student/set-up';
import Interests from '../../components/guidedtour/student/interests';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import CareerPath from '../../components/guidedtour/student/career-goals';
import Courses from '../../components/guidedtour/student/courses';
import Opportunities from '../../components/guidedtour/student/opportunities';
import DegreePlan from '../../components/guidedtour/student/degree-plan';
import ICE from '../../components/guidedtour/student/ice';
import Levels from '../../components/guidedtour/student/levels';
import SampleStudent from '../../components/guidedtour/student/sample-student';
import Mentor from '../../components/guidedtour/student/mentor';
import AdvisorLog from '../../components/guidedtour/student/advisor-log';
import WhatsNext from '../../components/guidedtour/student/whats-next';

interface IGuidedTourStudentProps {
  interests: number;
  careerGoals: string;
  courses: number;
  courseReviews: number;
  opportunities: number;
  mentors: number;
  mentorLocations: string;
  ready: boolean;
}

class GuidedTourStudent extends React.Component<IGuidedTourStudentProps> {
  constructor(props) {
    super(props);
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader active={true}>Getting data</Loader>;
  }

  public renderPage() {

    const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipeToSlide: true,
    };

    return (
      <div style={styles.background}>
        <Container textAlign="center">
          <Segment padded={true} style={styles.background}>
            <Slider {...settings}>
              <WhyRadGrad/>
              <SetUp/>
              <Interests interests={this.props.interests}/>
              <CareerPath careerGoals={this.props.careerGoals}/>
              <Courses courses={this.props.courses} courseReviews={this.props.courseReviews}/>
              <Opportunities opportunties={this.props.opportunities}/>
              <DegreePlan/>
              <ICE/>
              <Levels/>
              <SampleStudent/>
              <Mentor mentors={this.props.mentors} mentorLocations={this.props.mentorLocations}/>
              <AdvisorLog/>
              <WhatsNext/>
            </Slider>
          </Segment>
          <List.Item style={styles.a} as={NavLink} to="/">Return to RadGrad</List.Item>
        </Container>
        <LandingFooter/>
      </div>
    );
  }
}

const GuidedTourStudentContainer = withTracker(() => {
  const subscription = Meteor.subscribe(PublicStats.getPublicationName());
  let key;
  let interests;
  let careerGoals;
  let courses;
  let courseReviews;
  let opportunities;
  let mentors;
  let mentorLocations;
  if (subscription.ready() && !Meteor.isAppTest) {
    key = PublicStats.interestsTotalKey;
    interests = PublicStats.findDoc({ key }).value;
    key = PublicStats.careerGoalsListKey;
    careerGoals = PublicStats.findDoc({ key }).value;
    key = PublicStats.coursesTotalKey;
    courses = PublicStats.findDoc({ key }).value;
    key = PublicStats.courseReviewsTotalKey;
    courseReviews = PublicStats.findDoc({ key }).value;
    key = PublicStats.opportunitiesTotalKey;
    opportunities = PublicStats.findDoc({ key }).value;
    key = PublicStats.usersMentorsTotalKey;
    mentors = PublicStats.findDoc({ key }).value;
    key = PublicStats.usersMentorsLocationsKey;
    mentorLocations = PublicStats.findDoc({ key }).value;
  }
  return {
    ready: subscription.ready(),
    interests,
    careerGoals,
    courses,
    courseReviews,
    opportunities,
    mentors,
    mentorLocations,
  };
})(GuidedTourStudent);

export default GuidedTourStudentContainer;
