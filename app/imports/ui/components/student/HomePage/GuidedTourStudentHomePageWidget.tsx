import React from 'react';
import { Container, Loader } from 'semantic-ui-react';
import Slider from 'react-slick';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import styles from '../../../pages/landing/guidedtour-style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import WhyRadGrad from './home-why-radgrad';
import Interests from './home-interests';
import CareerPath from './home-career-goals';
import Courses from './home-courses';
import { PublicStats } from '../../../../api/public-stats/PublicStatsCollection';

interface IGuidedTourStudentProps {
  interests: number;
  careerGoals: string;
  courses: number;
  opportunities: number;
  ready: boolean;
}

const GuidedTourStudentHomePageWidget = (props: IGuidedTourStudentProps) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
  };

  if (props.ready) {
    return (
      <div style={styles.background} className="guidedTour">
        <Container>
          <Slider {...settings}>
            <WhyRadGrad />
            <Interests interests={props.interests} />
            <CareerPath careerGoals={props.careerGoals} />
            <Courses courses={props.courses} />
          </Slider>
        </Container>
      </div>
    );
  }
  return <Loader active>Getting data</Loader>;
};

const GuidedTourStudentHomePageWidgetCon = withTracker(() => {
  const subscription = Meteor.subscribe(PublicStats.getPublicationName());
  let key;
  let interests;
  let careerGoals;
  let courses;
  let opportunities;
  if (subscription.ready() && !Meteor.isAppTest) {
    key = PublicStats.interestsTotalKey;
    interests = PublicStats.findDoc({ key }).value;
    key = PublicStats.careerGoalsListKey;
    careerGoals = PublicStats.findDoc({ key }).value;
    key = PublicStats.coursesTotalKey;
    courses = PublicStats.findDoc({ key }).value;
    key = PublicStats.opportunitiesTotalKey;
    opportunities = PublicStats.findDoc({ key }).value;
  }
  return {
    ready: subscription.ready(),
    interests,
    careerGoals,
    courses,
    opportunities,
  };
})(GuidedTourStudentHomePageWidget);

export default GuidedTourStudentHomePageWidgetCon;
