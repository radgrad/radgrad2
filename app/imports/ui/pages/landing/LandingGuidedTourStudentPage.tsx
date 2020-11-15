import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, List, Loader, Segment } from 'semantic-ui-react';
import Slider from 'react-slick';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import styles from './guidedtour-style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LandingFooter from '../../components/landing/LandingFooter';
import WhyRadGrad from '../../components/landing/guided-tour/student/why-radgrad';
import SetUp from '../../components/landing/guided-tour/student/set-up';
import Interests from '../../components/landing/guided-tour/student/interests';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import CareerPath from '../../components/landing/guided-tour/student/career-goals';
import Courses from '../../components/landing/guided-tour/student/courses';
import Opportunities from '../../components/landing/guided-tour/student/opportunities';
import DegreePlan from '../../components/landing/guided-tour/student/degree-plan';
import ICE from '../../components/landing/guided-tour/student/ice';
import Levels from '../../components/landing/guided-tour/student/levels';
import SampleStudent from '../../components/landing/guided-tour/student/sample-student';
import AdvisorLog from '../../components/landing/guided-tour/student/advisor-log';
import WhatsNext from '../../components/landing/guided-tour/student/whats-next';

interface IGuidedTourStudentProps {
  // eslint-disable-next-line react/no-unused-prop-types
  interests: number;
  // eslint-disable-next-line react/no-unused-prop-types
  careerGoals: string;
  // eslint-disable-next-line react/no-unused-prop-types
  courses: number;
  // eslint-disable-next-line react/no-unused-prop-types
  courseReviews: number;
  // eslint-disable-next-line react/no-unused-prop-types
  opportunities: number;
  // eslint-disable-next-line react/no-unused-prop-types
  ready: boolean;
}

const renderPage = (props: IGuidedTourStudentProps) => {
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
        <Segment padded style={styles.background}>
          <Slider {...settings}>
            <WhyRadGrad />
            <SetUp />
            <Interests interests={props.interests} />
            <CareerPath careerGoals={props.careerGoals} />
            <Courses courses={props.courses} courseReviews={props.courseReviews} />
            <Opportunities opportunties={props.opportunities} />
            <DegreePlan />
            <ICE />
            <Levels />
            <SampleStudent />
            <AdvisorLog />
            <WhatsNext />
          </Slider>
        </Segment>
        <List.Item style={styles.a} as={NavLink} to="/">Return to RadGrad</List.Item>
      </Container>
      <LandingFooter />
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const LandingGuidedTourStudentPage = (props: IGuidedTourStudentProps) => ((props.ready) ? renderPage(props) : <Loader active>Getting data</Loader>);

const GuidedTourStudentContainer = withTracker(() => {
  const subscription = Meteor.subscribe(PublicStats.getPublicationName());
  let key;
  let interests;
  let careerGoals;
  let courses;
  let courseReviews;
  let opportunities;
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
  }
  return {
    ready: subscription.ready(),
    interests,
    careerGoals,
    courses,
    courseReviews,
    opportunities,
  };
})(LandingGuidedTourStudentPage);

export default GuidedTourStudentContainer;
