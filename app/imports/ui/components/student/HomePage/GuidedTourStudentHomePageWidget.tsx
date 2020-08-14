import React from 'react';
import { Container, Loader, Segment } from 'semantic-ui-react';
import Slider from 'react-slick';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import styles from '../../../pages/landing/guidedtour-style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import WhyRadGrad from '../../guidedtour/student/home-why-radgrad';
import Interests from '../../guidedtour/student/home-interests';
import CareerPath from '../../guidedtour/student/home-career-goals';
import Courses from '../../guidedtour/student/home-courses';
import { PublicStats } from '../../../../api/public-stats/PublicStatsCollection';

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
        <Segment padded style={styles.background} className="guidedTour">
          <Slider {...settings}>
            <WhyRadGrad />
            <Interests interests={props.interests} />
            <CareerPath careerGoals={props.careerGoals} />
            <Courses courses={props.courses} courseReviews={props.courseReviews} />
          </Slider>
        </Segment>
      </Container>
    </div>
  );
};

const GuidedTourStudent = (props: IGuidedTourStudentProps) => ((props.ready) ? renderPage(props) : <Loader active>Getting data</Loader>);

const GuidedTourStudentHomePageWidget = withTracker(() => {
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

export default GuidedTourStudentHomePageWidget;
