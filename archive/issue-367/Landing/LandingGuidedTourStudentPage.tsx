import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, List, Loader, Segment } from 'semantic-ui-react';
import Slider from 'react-slick';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import styles from '../guidedtour-style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LandingFooter from '../../../app/imports/ui/components/landing/LandingFooter';
import WhyRadGrad from '../guided-tour/student/why-radgrad';
import SetUp from '../guided-tour/student/set-up';
import Interests from '../guided-tour/student/interests';
import { PublicStats } from '../../../app/imports/api/public-stats/PublicStatsCollection';
import CareerPath from '../guided-tour/student/career-goals';
import Courses from '../guided-tour/student/courses';
import Opportunities from '../guided-tour/student/opportunities';
import DegreePlan from '../guided-tour/student/degree-plan';
import ICE from '../guided-tour/student/ice';
import Levels from '../guided-tour/student/levels';
import SampleStudent from '../guided-tour/student/sample-student';
import WhatsNext from '../guided-tour/student/whats-next';

interface GuidedTourStudentProps {
  interests: number;
  careerGoals: string;
  courses: number;
  courseReviews: number;
  opportunities: number;
  ready: boolean;
}

const renderPage: React.FC<GuidedTourStudentProps> = ({ courses, careerGoals, interests, opportunities, courseReviews }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
  };
  return (
    <div id="landing-guided-tour-student-page" style={styles.background}>
      <Container textAlign="center">
        <Segment padded style={styles.background}>
          <Slider {...settings}>
            <WhyRadGrad />
            <SetUp />
            <Interests interests={interests} />
            <CareerPath careerGoals={careerGoals} />
            <Courses courses={courses} courseReviews={courseReviews} />
            <Opportunities opportunities={opportunities} />
            <DegreePlan />
            <ICE />
            <Levels />
            <SampleStudent />
            <WhatsNext />
          </Slider>
        </Segment>
        <List.Item style={styles.a} as={NavLink} to="/">
          Return to RadGrad
        </List.Item>
      </Container>
      <LandingFooter />
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const LandingGuidedTourStudentPage: React.FC<GuidedTourStudentProps> = (props) => (props.ready ? renderPage(props) : <Loader active>Getting data</Loader>);

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
